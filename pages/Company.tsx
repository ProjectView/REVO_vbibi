
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge } from '../components/ui/Common';
import { MOCK_TEAMS } from '../constants';
import { Building2, Users, CreditCard, Upload, Plus, CheckCircle, Save, Loader2, ArrowUpRight, ExternalLink, AlertTriangle, MapPin, Mail, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useToast } from '../components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { getActiveSubscription, getAxonautPortalUrl } from '../services/axonautService';

export const Company = () => {
  const { user, companyId, companyData: globalCompanyData } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'general' | 'teams' | 'billing'>('general');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const subscription = getActiveSubscription();

  const [companyData, setCompanyData] = useState({
    name: '',
    siret: '',
    email: '',
    phone: '',
    address: '',
    simultaneousLimit: 3
  });

  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId || companyId.startsWith('offline_') || companyId.startsWith('demo-')) {
         setCompanyData({
            name: 'Ma Société (Mode Local)',
            siret: '123 456 789 00012',
            email: user?.email || 'contact@example.com',
            phone: '01 02 03 04 05',
            address: '10 Rue de la Paix, 75000 Paris',
            simultaneousLimit: Number(localStorage.getItem('revo_local_limit')) || 3
         });
         return;
      }

      setInitialLoading(true);
      try {
        const docRef = doc(db, 'companies', companyId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCompanyData({
             name: data.name || '',
             siret: data.siret || '',
             email: data.email || '',
             phone: data.phone || '',
             address: data.address || '',
             simultaneousLimit: data.simultaneousLimit || 3
          });
        }
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCompany();
  }, [companyId, user]);

  const handleSaveGeneral = async () => {
    if (!companyId) return;
    setLoading(true);

    if (companyId.startsWith('offline_') || companyId.startsWith('demo-')) {
       localStorage.setItem('revo_local_limit', companyData.simultaneousLimit.toString());
       setTimeout(() => {
          addToast("Modifications enregistrées (Localement)", "success");
          setLoading(false);
          window.location.reload();
       }, 800);
       return;
    }

    try {
      const docRef = doc(db, 'companies', companyId);
      await updateDoc(docRef, {
        ...companyData,
        simultaneousLimit: Number(companyData.simultaneousLimit),
        updatedAt: new Date()
      });
      addToast("Informations de l'entreprise mises à jour", "success");
    } catch (error) {
      console.error("Error updating company:", error);
      addToast("Erreur lors de la sauvegarde", "error");
    } finally {
      setLoading(false);
    }
  };

  const openAxonautPortal = async () => {
     const url = await getAxonautPortalUrl();
     window.open(url, '_blank');
  };

  return (
    <div className="w-full animate-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold font-heading text-neutralDark mb-6">Paramètres Société</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Sidebar */}
        <div className="md:col-span-1 space-y-2">
           <button 
             onClick={() => setActiveTab('general')}
             className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${activeTab === 'general' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-primary'}`}
           >
             <Building2 size={18} /> Général
           </button>
           <button 
             onClick={() => setActiveTab('teams')}
             className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${activeTab === 'teams' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-primary'}`}
           >
             <Users size={18} /> Équipes
           </button>
           <button 
             onClick={() => setActiveTab('billing')}
             className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${activeTab === 'billing' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-primary'}`}
           >
             <CreditCard size={18} /> Abonnement
           </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
           
           {activeTab === 'general' && (
             <Card className="space-y-8 relative overflow-hidden">
               {initialLoading && (
                  <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center">
                     <Loader2 className="animate-spin text-primary" size={32} />
                  </div>
               )}
               
               <div className="border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-bold text-neutralDark">Informations de l'entreprise</h3>
                  <p className="text-sm text-gray-500">Gérez votre identité et vos limites opérationnelles.</p>
               </div>
               
               <div className="flex flex-col lg:flex-row items-start gap-8">
                  <div className="relative group self-center lg:self-start">
                     <div className="w-32 h-32 bg-neutralDark rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-700 hover:border-primary cursor-pointer transition-all group-hover:scale-105">
                        <div className="text-center">
                           <Upload className="mx-auto text-gray-400 group-hover:text-primary mb-2" size={24} />
                           <span className="text-[10px] font-bold text-gray-500 uppercase">Logo Société</span>
                        </div>
                     </div>
                     <button className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-lg shadow-lg">
                        <Plus size={16} />
                     </button>
                  </div>

                  <div className="flex-1 w-full space-y-6">
                     <Input 
                        label="Nom de l'entreprise" 
                        value={companyData.name}
                        onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                        placeholder="Ma Société BTP"
                        icon={<Building2 size={18} />}
                     />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                           label="SIRET" 
                           value={companyData.siret}
                           onChange={(e) => setCompanyData({...companyData, siret: e.target.value})}
                           placeholder="123 456 789 00012"
                        />
                        <Input 
                           label="Limite de chantiers simultanés" 
                           type="number"
                           min="1"
                           value={companyData.simultaneousLimit}
                           onChange={(e) => setCompanyData({...companyData, simultaneousLimit: Number(e.target.value)})}
                           icon={<AlertTriangle size={18} className="text-accent" />}
                        />
                     </div>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                     label="Email de contact" 
                     value={companyData.email}
                     onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
                     icon={<Mail size={18} />}
                  />
                  <Input 
                     label="Téléphone" 
                     value={companyData.phone}
                     onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
                     icon={<Phone size={18} />}
                  />
               </div>
               
               <Input 
                  label="Adresse du siège social" 
                  multiline
                  rows={3} 
                  value={companyData.address}
                  onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
                  icon={<MapPin size={18} className="mt-1" />}
               />

               <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <Button onClick={handleSaveGeneral} isLoading={loading} size="lg" className="px-10">
                     <Save size={18} className="mr-2" /> Enregistrer les modifications
                  </Button>
               </div>
             </Card>
           )}

           {activeTab === 'teams' && (
             <Card className="space-y-6">
               <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div>
                     <h3 className="text-xl font-bold text-neutralDark">Gestion des Équipes</h3>
                     <p className="text-sm text-gray-500">Organisez vos collaborateurs par pôles d'expertise.</p>
                  </div>
                  <Button size="sm" variant="secondary"><Plus size={16} className="mr-2"/> Créer équipe</Button>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  {MOCK_TEAMS.map(team => (
                     <div key={team.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-all hover:shadow-sm">
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-xl ${team.color} flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-black/10`}>
                              {team.name.charAt(0)}
                           </div>
                           <div>
                              <h4 className="font-bold text-neutralDark text-lg">{team.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                 <Users size={14} /> {team.members.length} collaborateurs
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="flex -space-x-2">
                              {team.members.map((m, i) => (
                                 <div key={i} className="w-8 h-8 rounded-full bg-neutralDark border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                    {m}
                                 </div>
                              ))}
                           </div>
                           <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">Gérer</Button>
                        </div>
                     </div>
                  ))}
               </div>
             </Card>
           )}

           {activeTab === 'billing' && (
             <Card className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-bold text-neutralDark">Abonnement & Facturation</h3>
                  <p className="text-sm text-gray-500">Gérez votre croissance et accédez aux documents légaux.</p>
               </div>

               <div className="bg-neutralDark text-white p-8 rounded-2xl relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-40 bg-primary/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                     <div className="text-center md:text-left">
                        <Badge className={`${subscription.isPro ? 'bg-accent text-neutralDark border-accent' : 'bg-gray-700 text-white border-gray-600'} mb-4`}>
                           Plan {subscription.tier === 'free' ? 'Découverte' : subscription.tier === 'pro' ? 'Professionnel' : 'Entreprise'}
                        </Badge>
                        <h3 className="text-4xl font-bold mb-1">
                           {subscription.tier === 'free' ? '0€' : subscription.tier === 'pro' ? '49€' : '149€'} <span className="text-lg font-normal opacity-60">/ mois</span>
                        </h3>
                        <p className="text-white/50 text-sm mt-2">
                           {subscription.isPro ? `Prochaine facturation le ${subscription.nextBillingDate}` : 'Débloquez toutes les fonctionnalités IA.'}
                        </p>
                     </div>
                     <div className="flex flex-col gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 text-success text-sm font-bold bg-success/10 px-4 py-2 rounded-full border border-success/20 justify-center">
                           <CheckCircle size={16} /> Compte Actif
                        </div>
                        {subscription.isPro ? (
                           <Button className="bg-white text-neutralDark hover:bg-gray-100 border-none flex items-center justify-center gap-2 w-full" onClick={openAxonautPortal}>
                              Portail Axonaut <ExternalLink size={16}/>
                           </Button>
                        ) : (
                           <Button className="bg-accent text-neutralDark hover:bg-accent/90 border-none flex items-center justify-center gap-2 w-full" onClick={() => navigate('/pricing')}>
                              Améliorer mon plan <ArrowUpRight size={16} />
                           </Button>
                        )}
                     </div>
                  </div>
               </div>
             </Card>
           )}
        </div>
      </div>
    </div>
  );
};
