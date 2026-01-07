
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

/**
 * Service pour gérer l'intégration avec l'API Axonaut.
 * Documentation API Axonaut : https://axonaut.com/api/v2/doc
 */

// ⚠️ ATTENTION : Dans une vraie mise en production, cette clé ne doit pas être stockée ici (Frontend).
// Elle doit être sur un serveur sécurisé (Node.js / Firebase Functions).
// Pour la démo, nous l'utilisons ici pour montrer la connexion réelle.
const AXONAUT_API_KEY = '11866f0d47eaed3d699eb92e0fc23ba83f311186';
const USE_REAL_API = true; // Bascule pour activer/désactiver les vrais appels

// Proxy pour contourner les restrictions CORS du navigateur lors de la démo
// En production avec un backend, on appellerait directement https://axonaut.com/api/v2/...
const CORS_PROXY = 'https://corsproxy.io/?'; 
const API_URL = 'https://axonaut.com/api/v2';

interface CompanyData {
   name: string;
   email: string;
   siret?: string;
   vat?: string;
   address?: string;
   paymentToken?: string;
}

/**
 * Génère un lien de paiement (Simulation pour l'UX)
 */
export const getAxonautPaymentLink = async (amount: number, reference: string, email: string): Promise<string> => {
   // Dans un vrai flux, on pourrait appeler l'API pour générer une facture et récupérer son lien public
   // Ici on garde la logique de redirection vers notre page de checkout interne
   return `/axonaut-checkout?ref=${reference}&amount=${amount}&email=${email}`;
};

/**
 * Crée réellement la société dans Axonaut via l'API
 * Retourne l'ID Axonaut de la société créée (ou null en cas d'erreur/mock)
 */
export const createAxonautSubscription = async (planId: string, companyData: CompanyData): Promise<number | null> => {
   console.log(`[Axonaut Service] Tentative de création pour : ${companyData.name}`);

   if (USE_REAL_API) {
      try {
         // Préparation de l'adresse (Axonaut demande des champs séparés, on fait au mieux avec une string unique)
         const addressParts = (companyData.address || '').split(',');
         const street = addressParts[0] || '';
         const cityZip = addressParts[1] || ''; 
         
         const payload = {
            name: companyData.name,
            address_street: street,
            address_city: cityZip.trim(), // Simplification pour la démo
            siret: companyData.siret || '',
            intracommunity_vat: companyData.vat || '',
            is_prospect: false,
            is_customer: true, // On le marque directement comme client
            custom_fields: {
               "Plan REVO": planId // Exemple si vous avez un champ personnalisé
            }
         };

         console.log("[Axonaut Service] Envoi Payload:", payload);

         const response = await fetch(`${CORS_PROXY}${encodeURIComponent(`${API_URL}/companies`)}`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'user-agent': 'REVO App',
               'x-axonaut-key': AXONAUT_API_KEY
            },
            body: JSON.stringify(payload)
         });

         if (!response.ok) {
            const errorText = await response.text();
            console.error("[Axonaut API Error]", errorText);
            throw new Error(`Erreur Axonaut: ${response.statusText}`);
         }

         const result = await response.json();
         console.log("✅ [Axonaut API] Société créée avec succès ! ID:", result.id);
         
         // Mise à jour locale pour l'UI
         localStorage.setItem('revo_subscription_tier', planId);
         localStorage.setItem('revo_subscription_status', 'active');
         
         return result.id; // On retourne l'ID Axonaut

      } catch (error) {
         console.error("[Axonaut Service] Échec de l'appel API (CORS ou Réseau):", error);
         console.warn("Passage en mode simulation pour ne pas bloquer l'utilisateur.");
         return null;
      }
   } else {
      // Simulation délai réseau
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`[Axonaut Simulation] Société ${companyData.name} créée fictivement.`);
      
      localStorage.setItem('revo_subscription_tier', planId);
      localStorage.setItem('revo_subscription_status', 'active');
      return 99999; // Mock ID
   }
};

/**
 * Récupère les détails d'une société Axonaut par son ID
 */
export const getAxonautCompany = async (axonautId: number): Promise<any> => {
   console.log(`[Axonaut Service] Récupération détails société ID: ${axonautId}`);
   
   if (!USE_REAL_API) {
      return { id: axonautId, name: 'Société Mock', address_street: '123 Fake St' };
   }

   try {
      const response = await fetch(`${CORS_PROXY}${encodeURIComponent(`${API_URL}/companies/${axonautId}`)}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'user-agent': 'REVO App',
            'x-axonaut-key': AXONAUT_API_KEY
         }
      });

      if (!response.ok) {
         throw new Error(`Erreur Fetch Axonaut: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ [Axonaut API] Données récupérées :", data);
      return data;

   } catch (error) {
      console.error("[Axonaut Service] Erreur récupération détails:", error);
      return null;
   }
};

export const getAxonautPortalUrl = async (): Promise<string> => {
   return 'https://axonaut.com/portal/login'; 
};

export const getActiveSubscription = () => {
   const tier = localStorage.getItem('revo_subscription_tier') || 'free';
   const status = localStorage.getItem('revo_subscription_status') || 'active';
   
   return {
      tier,
      status,
      isPro: tier === 'pro' || tier === 'enterprise',
      nextBillingDate: '15 Déc 2025', 
      provider: 'Axonaut'
   };
};
