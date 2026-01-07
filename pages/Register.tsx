
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui/Common';
import { getAxonautPaymentLink } from '../services/axonautService';
import { CheckCircle, Building2, User, CreditCard, ArrowLeft, ArrowRight, ShieldCheck, AlertCircle, ExternalLink, MapPin } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

export const Register = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    siret: '',
    vatNumber: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleNextStep = () => {
    if (step === 1) {
       if (!formData.email || !formData.password || !formData.confirmPassword) {
          setError("Tous les champs sont obligatoires.");
          return;
       }
       if (formData.password !== formData.confirmPassword) {
          setError("Les mots de passe ne correspondent pas.");
          return;
       }
       if (formData.password.length < 6) {
          setError("Le mot de passe doit contenir au moins 6 caractères.");
          return;
       }
    }
    
    if (step === 2) {
       if (!formData.companyName || !formData.siret || !formData.address) {
          setError("Veuillez remplir les informations de l'entreprise.");
          return;
       }
    }

    setStep(s => s + 1);
  };

  const handleRedirectToPayment = async () => {
    setLoading(true);
    setError('');

    try {
      const ref = `SUB-${Date.now().toString().substring(6)}`;
      addToast("Dossier validé. Redirection vers le paiement sécurisé...", "info");
      
      setTimeout(() => {
         navigate('/axonaut-checkout', { 
            state: {
               formData: formData,
               amount: '58.80',
               ref: ref
            }
         });
      }, 800);

    } catch (err: any) {
      console.error(err);
      setError("Erreur lors de la redirection.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-3xl">
         {/* Logo */}
         <div className="flex items-center justify-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/')}>
             <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-heading font-bold text-xl">R</span>
             </div>
             <span className="font-heading font-bold text-2xl text-neutralDark">REVO</span>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 space-y-4">
               {[
                  { id: 1, icon: User, label: "Mon Compte" },
                  { id: 2, icon: Building2, label: "Ma Société" },
                  { id: 3, icon: CreditCard, label: "Paiement" }
               ].map((item) => (
                  <div 
                     key={item.id} 
                     className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        step === item.id 
                           ? 'bg-white border-primary shadow-md text-primary' 
                           : step > item.id 
                              ? 'bg-primary/5 border-transparent text-primary/60' 
                              : 'bg-white border-transparent text-gray-400'
                     }`}
                  >
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        step === item.id ? 'bg-primary text-white' : step > item.id ? 'bg-primary/20 text-primary' : 'bg-gray-100'
                     }`}>
                        {step > item.id ? <CheckCircle size={16} /> : item.id}
                     </div>
                     <span className="font-medium">{item.label}</span>
                  </div>
               ))}

               {step === 3 && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 flex items-start gap-3">
                     <ShieldCheck size={20} className="shrink-0 mt-0.5" />
                     <p>Vous allez être redirigé vers l'interface sécurisée Axonaut pour valider votre mandat de prélèvement.</p>
                  </div>
               )}
            </div>

            <Card className="col-span-2 p-8 relative min-h-[500px] flex flex-col">
               
               {error && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-danger text-sm animate-in fade-in">
                     <AlertCircle size={16} className="shrink-0 mt-0.5" /> 
                     <span>{error}</span>
                  </div>
               )}

               {step === 1 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                     <div>
                        <h2 className="text-xl font-bold font-heading mb-1">Créons vos identifiants</h2>
                        <p className="text-gray-500 text-sm">Pour sécuriser votre espace administrateur.</p>
                     </div>
                     <Input 
                        name="email"
                        label="Email professionnel" 
                        type="email" 
                        placeholder="contact@entreprise.com" 
                        value={formData.email}
                        onChange={handleChange}
                        autoFocus
                     />
                     <Input 
                        name="password"
                        label="Mot de passe" 
                        type="password" 
                        placeholder="••••••••" 
                        value={formData.password}
                        onChange={handleChange}
                     />
                     <Input 
                        name="confirmPassword"
                        label="Confirmer le mot de passe" 
                        type="password" 
                        placeholder="••••••••" 
                        value={formData.confirmPassword}
                        onChange={handleChange}
                     />
                     
                     <div className="mt-auto pt-8 flex justify-between items-center">
                        <button onClick={() => navigate('/login')} className="text-gray-500 text-sm hover:text-primary transition-colors">
                           J'ai déjà un compte
                        </button>
                        <Button onClick={handleNextStep} className="flex items-center gap-2">
                           Suivant <ArrowRight size={16} />
                        </Button>
                     </div>
                  </div>
               )}

               {step === 2 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                     <div>
                        <h2 className="text-xl font-bold font-heading mb-1">Informations Légales</h2>
                        <p className="text-gray-500 text-sm">Nécessaires pour l'émission de vos factures via Axonaut.</p>
                     </div>
                     
                     <Input 
                        name="companyName"
                        label="Raison Sociale" 
                        placeholder="Ma Société SARL" 
                        value={formData.companyName}
                        onChange={handleChange}
                        autoFocus
                        icon={<Building2 size={18}/>}
                     />
                     
                     <div className="grid grid-cols-2 gap-4">
                        <Input 
                           name="siret"
                           label="Numéro SIRET" 
                           placeholder="123 456 789 00012" 
                           value={formData.siret}
                           onChange={handleChange}
                        />
                         <Input 
                           name="vatNumber"
                           label="Numéro TVA" 
                           placeholder="FR 12 345678900" 
                           value={formData.vatNumber}
                           onChange={handleChange}
                        />
                     </div>

                     <Input 
                        name="address"
                        label="Adresse de facturation"
                        multiline
                        rows={3}
                        placeholder="10 Rue de la Paix, 75000 Paris"
                        value={formData.address}
                        onChange={handleChange}
                        icon={<MapPin size={18} className="mt-1"/>}
                     />

                     <div className="mt-auto pt-8 flex justify-between items-center">
                        <Button variant="ghost" onClick={() => setStep(1)} className="flex items-center gap-2">
                           <ArrowLeft size={16} /> Retour
                        </Button>
                        <Button onClick={handleNextStep} className="flex items-center gap-2">
                           Suivant <ArrowRight size={16} />
                        </Button>
                     </div>
                  </div>
               )}

               {step === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                     <div>
                        <h2 className="text-xl font-bold font-heading mb-1">Finaliser l'abonnement</h2>
                        <p className="text-gray-500 text-sm">Vous êtes à un clic de digitaliser votre activité.</p>
                     </div>

                     <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                           <div>
                              <div className="font-bold text-neutralDark">Abonnement REVO Artisan Pro</div>
                              <div className="text-xs text-gray-500">Facturation mensuelle</div>
                           </div>
                           <div className="text-xl font-bold text-neutralDark">49,00 € <span className="text-xs font-normal text-gray-400">HT</span></div>
                        </div>
                        <div className="flex justify-between items-center">
                           <div>
                              <div className="font-bold text-neutralDark">TVA (20%)</div>
                           </div>
                           <div className="text-neutralDark">9,80 €</div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                           <div className="font-bold text-lg text-primary">Total à payer</div>
                           <div className="text-2xl font-bold text-primary">58,80 € <span className="text-sm font-normal text-gray-500">TTC</span></div>
                        </div>
                     </div>

                     <div className="text-center">
                        <p className="text-sm text-gray-500 mb-6">
                           En cliquant sur le bouton ci-dessous, vous serez redirigé vers <strong>Axonaut</strong> pour procéder au paiement sécurisé.
                           <br/><span className="text-xs italic">Votre compte sera activé immédiatement après le paiement.</span>
                        </p>
                        
                        <Button 
                           onClick={handleRedirectToPayment} 
                           className="w-full py-4 text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2" 
                           isLoading={loading}
                        >
                           {loading ? 'Redirection...' : 'Payer via Axonaut'} {!loading && <ExternalLink size={18} />}
                        </Button>
                     </div>

                     <div className="mt-auto pt-4 flex justify-start">
                        <Button variant="ghost" onClick={() => setStep(2)} className="flex items-center gap-2" disabled={loading}>
                           <ArrowLeft size={16} /> Retour
                        </Button>
                     </div>
                  </div>
               )}

            </Card>
         </div>
      </div>
    </div>
  );
};
