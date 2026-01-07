
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Common';
import { Check, X, Shield, Star, ArrowLeft, FileText, Mail } from 'lucide-react';
import { createAxonautSubscription } from '../services/axonautService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const PricingPage = () => {
  const navigate = useNavigate();
  const { user, companyId } = useAuth();
  const { addToast } = useToast();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string, planName: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoadingPlan(planId);
    try {
      // Récupération des données de la société pour l'envoyer à Axonaut
      let companyData = { name: 'Société Inconnue', email: user.email };
      if (companyId && !companyId.startsWith('offline_')) {
         try {
            const snap = await getDoc(doc(db, 'companies', companyId));
            if (snap.exists()) {
               companyData = { ...companyData, ...snap.data() };
            }
         } catch(e) { console.warn("Erreur fetch company data", e); }
      }

      // Appel au service Axonaut
      await createAxonautSubscription(planId, companyData);
      
      addToast(`Plan ${planName} activé ! Vous allez recevoir votre facture par email via Axonaut.`, 'success');
      
      // Redirection vers le dashboard après succès
      setTimeout(() => {
        navigate('/dashboard');
        // Force reload to refresh context in this demo
        window.location.reload(); 
      }, 2000);
      
    } catch (error) {
      addToast("Erreur lors de la communication avec Axonaut.", "error");
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Découverte',
      price: 0,
      description: 'Pour les artisans indépendants qui se lancent.',
      features: [
        'Jusqu\'à 3 chantiers actifs',
        'Gestion clients basique',
        'Planning simplifié',
        'Support email standard',
      ],
      notIncluded: [
        'IA Générative (Gemini)',
        'Mode hors-ligne avancé',
        'Export comptable',
        'Multi-utilisateurs'
      ],
      popular: false,
      buttonText: 'Plan Actuel',
      disabled: true
    },
    {
      id: 'pro',
      name: 'Artisan Pro',
      price: billingCycle === 'monthly' ? 49 : 39,
      description: 'La solution complète pour gérer votre activité sereinement.',
      features: [
        'Chantiers illimités',
        'IA Générative (Checklists & Devis)',
        'Mode Hors-ligne complet',
        'Stockage photos illimité',
        'Support prioritaire 7j/7',
        '3 utilisateurs inclus'
      ],
      notIncluded: [
        'API personnalisée'
      ],
      popular: true,
      buttonText: 'Choisir Pro',
      disabled: false
    },
    {
      id: 'enterprise',
      name: 'Entreprise',
      price: billingCycle === 'monthly' ? 149 : 129,
      description: 'Pour les PME du BTP avec plusieurs équipes.',
      features: [
        'Tout le plan Pro',
        'Utilisateurs illimités',
        'Gestion multi-équipes',
        'Tableaux de bord personnalisés',
        'Formation dédiée',
        'Accès API'
      ],
      notIncluded: [],
      popular: false,
      buttonText: 'Contacter les ventes',
      disabled: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-[#1D4ED8] pt-20 pb-32 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <button 
           onClick={() => navigate(-1)} 
           className="absolute top-6 left-6 text-white/80 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
        >
           <ArrowLeft size={16} /> Retour
        </button>
        
        <h1 className="text-4xl font-heading font-bold text-white mb-4 relative z-10">
          Investissez dans votre tranquillité
        </h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto relative z-10">
          Facturation centralisée et sécurisée via notre partenaire <strong>Axonaut</strong>.
        </p>

        {/* Toggle Monthly/Yearly */}
        <div className="mt-8 flex justify-center relative z-10">
          <div className="bg-blue-800/50 p-1 rounded-xl border border-white/20 flex items-center relative">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                billingCycle === 'monthly' ? 'bg-white text-blue-800 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                billingCycle === 'yearly' ? 'bg-white text-blue-800 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              Annuel <span className="text-[10px] bg-accent text-neutralDark px-1.5 py-0.5 rounded ml-1">-20%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative bg-white rounded-2xl shadow-xl border-2 flex flex-col ${
                plan.popular ? 'border-accent scale-105 z-10' : 'border-transparent hover:border-gray-200'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-accent text-neutralDark font-bold px-4 py-1 rounded-full text-sm shadow-sm flex items-center gap-1">
                  <Star size={14} fill="currentColor" /> Recommandé
                </div>
              )}

              <div className="p-8 flex-1">
                <h3 className="text-xl font-bold text-neutralDark mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-sm h-10 mb-6">{plan.description}</p>
                
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-heading font-bold text-neutralDark">{plan.price}€</span>
                  <span className="text-gray-500 ml-2">/mois</span>
                  <span className="text-xs text-gray-400 ml-2">HT</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <div className="mt-0.5 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                        <Check size={12} className="text-green-600" />
                      </div>
                      {feature}
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                      <div className="mt-0.5 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                        <X size={12} className="text-gray-400" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 pt-0 mt-auto">
                <Button 
                  onClick={() => handleSubscribe(plan.id, plan.name)}
                  className={`w-full py-4 text-base ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-gray-100 text-neutralDark hover:bg-gray-200'}`}
                  disabled={plan.disabled || loadingPlan !== null}
                  isLoading={loadingPlan === plan.id}
                >
                  {plan.buttonText}
                </Button>
                {plan.id === 'free' && (
                   <p className="text-center text-xs text-gray-400 mt-3">Pas de carte requise</p>
                )}
                 {plan.id !== 'free' && (
                   <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                      <FileText size={12} /> Facture Pro + TVA récupérable
                   </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
           <h2 className="text-2xl font-bold text-center mb-10 text-neutralDark">Questions Fréquentes</h2>
           <div className="space-y-6">
              {[
                 { q: "Comment se passe le paiement ?", a: "Nous utilisons Axonaut pour la facturation. Vous recevrez automatiquement votre facture par email ainsi qu'un lien sécurisé pour régler par CB ou mettre en place un prélèvement." },
                 { q: "Puis-je changer de plan plus tard ?", a: "Oui, contactez le support ou changez de plan ici. Votre facturation Axonaut sera ajustée au prorata le mois suivant." },
                 { q: "Les factures sont-elles conformes ?", a: "Absolument. Toutes nos factures sont émises par une société française via un logiciel certifié (Axonaut) et comportent la TVA." }
              ].map((faq, i) => (
                 <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <h4 className="font-bold text-lg mb-2 text-neutralDark">{faq.q}</h4>
                    <p className="text-gray-600">{faq.a}</p>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
