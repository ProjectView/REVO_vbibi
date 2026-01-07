
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, CheckCircle, ArrowRight, Building2, AlertCircle, ExternalLink } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { Input, Button } from '../components/ui/Common';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { createAxonautSubscription, getAxonautCompany } from '../services/axonautService';

export const AxonautCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  
  // Récupération des données passées depuis le Register
  const stateData = location.state || {};
  const formData = stateData.formData;
  
  const amount = stateData.amount || '58.80';
  const reference = stateData.ref || 'INV-001';
  const email = formData?.email || 'client@email.com';

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'review' | 'payment' | 'success'>('review');
  const [error, setError] = useState('');

  // Protection : Si pas de données de formulaire, on renvoie à l'inscription
  useEffect(() => {
     if (!formData) {
        navigate('/register');
     }
  }, [formData, navigate]);

  const handlePaymentAndCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
       // 1. CRÉATION RÉELLE DANS AXONAUT (Via Service)
       console.log("Initialisation création Axonaut...");
       const axonautId = await createAxonautSubscription('pro', {
          name: formData.companyName,
          email: formData.email,
          siret: formData.siret,
          vat: formData.vatNumber,
          address: formData.address
       });

       if (axonautId) {
          // Petit test immédiat pour voir si on peut récupérer les infos (vérification API)
          getAxonautCompany(axonautId).then(details => {
             console.log("Vérification données Axonaut:", details);
          });
       }

       // 2. Création Auth Firebase
       console.log("Création du compte Firebase...");
       const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
       const user = userCredential.user;

       // 3. Setup Firestore
       const newCompanyId = `comp_${user.uid}`;

       await setDoc(doc(db, 'users', user.uid), {
         email: user.email,
         companyId: newCompanyId,
         role: 'admin',
         createdAt: serverTimestamp()
       });

       await setDoc(doc(db, 'companies', newCompanyId), {
         name: formData.companyName,
         siret: formData.siret,
         vatNumber: formData.vatNumber,
         address: formData.address,
         ownerId: user.uid,
         createdAt: serverTimestamp(),
         subscriptionStatus: 'active',
         subscriptionPlan: 'pro',
         axonautLinked: !!axonautId,
         axonautId: axonautId // Sauvegarde de l'ID externe
       });

       setStep('success');
       
    } catch (err: any) {
       console.error(err);
       if (err.code === 'auth/email-already-in-use') {
          setError("Ce compte semble déjà exister. Connectez-vous.");
       } else {
          setError("Erreur technique : " + err.message);
       }
    } finally {
       setLoading(false);
    }
  };

  const handleReturn = () => {
     navigate('/dashboard');
     window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 font-sans text-[#2C3E50]">
      <div className="bg-white max-w-4xl w-full rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
         
         {/* Left Side: Invoice Summary */}
         <div className="w-full md:w-1/2 bg-[#2C3E50] text-white p-8 flex flex-col justify-between relative overflow-hidden">
             {/* Abstract Bg */}
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
             <div className="absolute bottom-10 right-10 w-60 h-60 bg-[#1ABC9C]/10 rounded-full blur-3xl"></div>

             <div>
                <div className="flex items-center gap-2 mb-8">
                   <div className="text-2xl font-bold tracking-tight">axonaut</div>
                </div>

                <div className="mb-8">
                   <p className="text-white/60 text-sm uppercase tracking-wider mb-1">Montant à régler</p>
                   <div className="text-4xl font-bold">{amount} € <span className="text-lg font-normal text-white/60">TTC</span></div>
                </div>

                <div className="space-y-4 border-t border-white/10 pt-6">
                   <div className="flex justify-between text-sm">
                      <span className="text-white/70">Référence</span>
                      <span className="font-mono">{reference}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-white/70">Bénéficiaire</span>
                      <span className="font-medium">REVO SAS</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-white/70">Votre Email</span>
                      <span className="font-medium truncate ml-4">{email}</span>
                   </div>
                </div>
             </div>

             <div className="mt-8 flex items-center gap-2 text-xs text-white/50">
                <ShieldCheck size={14} /> Connexion sécurisée à votre espace Axonaut
             </div>
         </div>

         {/* Right Side: Payment Form */}
         <div className="w-full md:w-1/2 p-8 bg-white relative">
            
            {error && (
               <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded text-red-600 text-sm flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0"/> {error}
               </div>
            )}

            {step === 'review' && (
               <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-bold mb-6 text-[#2C3E50]">Récapitulatif de la commande</h2>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
                     <div className="flex items-start gap-3">
                        <Building2 className="text-[#1ABC9C] mt-1" size={20} />
                        <div>
                           <h4 className="font-bold text-sm">Abonnement REVO Artisan Pro</h4>
                           <p className="text-xs text-gray-500 mt-1">Création de votre fiche client Axonaut.</p>
                           {formData?.companyName && (
                              <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-200">Pour : {formData.companyName}</p>
                           )}
                        </div>
                     </div>
                  </div>

                  <div className="mt-auto">
                     <Button 
                        onClick={() => setStep('payment')} 
                        className="w-full bg-[#1ABC9C] hover:bg-[#16a085] text-white py-3 rounded shadow-lg shadow-[#1ABC9C]/20 border-none font-bold text-lg"
                     >
                        Valider mes informations
                     </Button>
                  </div>
               </div>
            )}

            {step === 'payment' && (
               <form onSubmit={handlePaymentAndCreateAccount} className="h-full flex flex-col animate-in fade-in slide-in-from-right-4">
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="text-xl font-bold text-[#2C3E50]">Paiement par Carte</h2>
                     <div className="flex gap-1">
                        <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200"></div>
                        <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200"></div>
                     </div>
                  </div>

                  {/* NOTE: Ce formulaire est une simulation visuelle pour l'UX. 
                      Pour un vrai paiement, nous devons utiliser un lien Stripe.
                      Cependant, l'action de soumission va réellement créer le client dans Axonaut API.
                  */}
                  <div className="space-y-4">
                     <Input label="Titulaire de la carte" placeholder="M. Jean Dupont" required />
                     <Input 
                        label="Numéro de carte" 
                        placeholder="4242 4242 4242 4242" 
                        icon={<CreditCard size={16}/>} 
                        required 
                     />
                     <div className="grid grid-cols-2 gap-4">
                        <Input label="Expiration" placeholder="MM/AA" required />
                        <Input label="CVC" placeholder="123" icon={<Lock size={16}/>} type="password" required />
                     </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-400 text-center">
                     En cliquant, vous acceptez la création de votre compte client dans notre système Axonaut.
                  </div>

                  <div className="mt-auto pt-4">
                     <Button 
                        type="submit" 
                        isLoading={loading}
                        className="w-full bg-[#1ABC9C] hover:bg-[#16a085] text-white py-3 rounded shadow-lg shadow-[#1ABC9C]/20 border-none font-bold text-lg flex items-center justify-center gap-2"
                     >
                        {loading ? 'Création en cours...' : `Payer ${amount} €`}
                     </Button>
                  </div>
               </form>
            )}

            {step === 'success' && (
               <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                     <CheckCircle size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">Bienvenue chez REVO !</h2>
                  <p className="text-gray-500 mb-8 max-w-xs mx-auto">Votre société a bien été enregistrée dans notre système Axonaut. Vous allez recevoir votre facture par email.</p>
                  
                  <Button 
                     onClick={handleReturn}
                     className="bg-[#2C3E50] hover:bg-[#34495e] text-white px-8 py-3 rounded shadow-lg flex items-center gap-2"
                  >
                     Accéder à mon espace <ArrowRight size={16} />
                  </Button>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};
