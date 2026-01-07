
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

/**
 * Service pour gérer l'intégration Stripe.
 * Dans une application réelle, ces fonctions appelleraient votre backend (Cloud Functions / Node.js)
 * qui lui-même communiquerait avec l'API Stripe de manière sécurisée.
 */

export const createCheckoutSession = async (priceId: string): Promise<void> => {
  // 1. Simulation d'un délai réseau (appel API)
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 2. Logique de simulation pour la démo
  console.log(`[Stripe Mock] Création session checkout pour ${priceId}`);

  // Pour la démo, on met à jour le localStorage pour simuler un état "Abonné"
  // Dans la réalité, c'est le Webhook Stripe qui mettrait à jour Firestore
  localStorage.setItem('revo_subscription_tier', 'pro');
  localStorage.setItem('revo_subscription_status', 'active');
  
  // On simule aussi la mise à jour Firestore si possible (pour que le contexte se rafraîchisse)
  // Note: Ceci échouera silencieusement si l'utilisateur est hors-ligne/demo
  try {
     const currentUser = JSON.parse(localStorage.getItem('revo_current_user') || '{}');
     if (currentUser && currentUser.uid) {
        // Optionnel: update firestore
     }
  } catch (e) {
     // ignore
  }

  return Promise.resolve();
};

export const getPortalUrl = async (): Promise<string> => {
   // Simulation délai
   await new Promise(resolve => setTimeout(resolve, 1000));
   
   // Dans une vraie app, cela renverrait l'URL du portail client Stripe
   // Pour la démo, on renvoie vers une page factice ou on reload
   return '/settings'; 
};

export const getActiveSubscription = () => {
   // Lecture de l'état local pour la démo
   const tier = localStorage.getItem('revo_subscription_tier') || 'free';
   const status = localStorage.getItem('revo_subscription_status') || 'active';
   
   return {
      tier,
      status,
      isPro: tier === 'pro' || tier === 'enterprise',
      nextBillingDate: '15 Nov 2025'
   };
};
