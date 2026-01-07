
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '../components/ui/Common';
import { 
  HardHat, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Menu, 
  X, 
  Star,
  Smartphone,
  FileSpreadsheet,
  Check,
  LayoutDashboard,
  Clock,
  MoreHorizontal
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-neutralDark selection:bg-primary/20">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-heading font-bold text-xl">R</span>
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight">REVO</span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
              <button onClick={() => scrollTo('features')} className="hover:text-primary transition-colors">Fonctionnalités</button>
              <button onClick={() => scrollTo('benefits')} className="hover:text-primary transition-colors">Avantages</button>
              <button onClick={() => navigate('/pricing')} className="hover:text-primary transition-colors">Tarifs</button>
            </div>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                <button onClick={() => navigate('/login')} className="font-bold text-gray-600 hover:text-primary transition-colors">Connexion</button>
                <Button onClick={() => navigate('/login')} className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                  Essayer Gratuitement
                </Button>
              </div>
              <button className="md:hidden text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 p-6 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-5">
            <button onClick={() => scrollTo('features')} className="text-left font-medium text-lg py-2">Fonctionnalités</button>
            <button onClick={() => scrollTo('benefits')} className="text-left font-medium text-lg py-2">Avantages</button>
            <button onClick={() => { navigate('/pricing'); setIsMobileMenuOpen(false); }} className="text-left font-medium text-lg py-2">Tarifs</button>
            <hr className="border-gray-100" />
            <Button onClick={() => navigate('/login')} className="w-full justify-center py-3">Créer un compte</Button>
            <button onClick={() => navigate('/login')} className="text-center font-bold text-gray-500 py-2">Se connecter</button>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden relative">
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-secondary/40 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[80px] opacity-60 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center z-10">
          
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-1.5 rounded-full text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm hover:shadow-md transition-shadow cursor-default">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-gray-600">Nouveau : IA Générative incluse</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold text-neutralDark tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700">
            Retrouvez la maîtrise de <br className="hidden md:block"/>
            vos <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500 relative">
              chantiers
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-secondary -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>.
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            La plateforme tout-en-un qui remplace vos fichiers Excel et vos agendas papier.
            Planifiez, gérez et facturez sans friction.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform" onClick={() => navigate('/login')}>
              Commencer gratuitement <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button variant="secondary" size="lg" className="h-14 px-8 text-lg rounded-full hover:bg-white border-2 border-transparent hover:border-gray-100 transition-all">
              Voir la démo live
            </Button>
          </div>

          <p className="mt-6 text-sm text-gray-400 animate-in fade-in duration-1000 delay-300">
            Aucune carte bancaire requise • 14 jours d'essai gratuit
          </p>

          {/* 3D Dashboard Mockup (Simulated in Code) */}
          <div className="mt-20 relative mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 perspective-1000">
            {/* Glow effect behind */}
            <div className="absolute inset-0 bg-primary/20 blur-[80px] -z-10 transform scale-90"></div>
            
            <div className="bg-neutralDark rounded-2xl p-2 shadow-2xl border border-gray-800 transform rotate-x-6 hover:rotate-x-0 transition-transform duration-700 ease-out origin-center">
              <div className="bg-white rounded-xl overflow-hidden border border-gray-800 relative flex flex-col h-[500px] md:h-[600px]">
                
                {/* Fake Browser Header */}
                <div className="bg-gray-900 px-4 py-3 flex items-center gap-2 border-b border-gray-800 shrink-0">
                  <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mx-auto bg-gray-800 text-gray-400 text-xs px-20 py-1.5 rounded-md font-mono flex items-center gap-2 opacity-50">
                     <ShieldCheck size={10} className="text-green-500"/> app.revo.btp/dashboard
                  </div>
                </div>

                {/* App Simulation */}
                <div className="flex flex-1 overflow-hidden bg-[#F8F9FA]">
                  
                  {/* Sidebar - Dark Theme */}
                  <div className="w-64 bg-[#1e1e1e] border-r border-gray-800 hidden md:flex flex-col p-4 gap-2 text-gray-300">
                     <div className="flex items-center gap-3 px-2 mb-6 text-white">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">R</div>
                        <span className="font-bold tracking-tight">REVO</span>
                     </div>
                     {/* Menu Items */}
                     {[
                         { i: LayoutDashboard, l: 'Tableau de bord', a: true },
                         { i: Calendar, l: 'Planning', a: false },
                         { i: HardHat, l: 'Chantiers', a: false },
                         { i: Users, l: 'Clients', a: false },
                     ].map((Item, i) => (
                         <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${Item.a ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-white/5'}`}>
                             <Item.i size={18} /> {Item.l}
                         </div>
                     ))}
                     {/* Bottom Card */}
                     <div className="mt-auto bg-gray-800/50 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 mb-2 text-white">
                            <Zap size={14} className="text-accent fill-accent" />
                            <span className="font-bold text-xs">Plan Pro</span>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full w-full overflow-hidden">
                            <div className="h-full bg-accent w-[75%]"></div>
                        </div>
                     </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 p-6 overflow-hidden flex flex-col gap-6">
                     {/* Header */}
                     <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-2xl font-bold text-neutralDark">Tableau de bord</h2>
                          <p className="text-xs text-gray-400">Bon retour, Thomas 👋</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                              <img src="https://i.pravatar.cc/100?u=admin" alt="Admin" />
                           </div>
                        </div>
                     </div>

                     {/* KPIs */}
                     <div className="grid grid-cols-3 gap-4">
                        {[
                            { l: 'Chantiers en cours', v: '8', i: HardHat, c: 'text-blue-600', bg: 'bg-blue-50' },
                            { l: 'Budget global', v: '124k€', i: TrendingUp, c: 'text-green-600', bg: 'bg-green-50' },
                            { l: 'Devis signés', v: '12', i: CheckCircle, c: 'text-purple-600', bg: 'bg-purple-50' },
                        ].map((k, i) => (
                            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-28 relative overflow-hidden">
                                <div className={`absolute right-2 top-2 p-2 rounded-lg ${k.bg} ${k.c} opacity-20`}>
                                    <k.i size={24} />
                                </div>
                                <span className="text-gray-500 text-xs font-medium uppercase">{k.l}</span>
                                <span className="text-2xl font-bold text-neutralDark">{k.v}</span>
                                <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold">
                                    <TrendingUp size={10} /> +12% ce mois
                                </div>
                            </div>
                        ))}
                     </div>

                     {/* Chart & List */}
                     <div className="flex gap-4 h-full min-h-0">
                         {/* Chart Area */}
                         <div className="flex-[2] bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                               <h3 className="font-bold text-sm text-gray-800">Revenus</h3>
                            </div>
                            <div className="flex-1 flex items-end justify-between gap-2 px-2">
                                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                    <div key={i} className="w-full bg-gray-100 rounded-t-sm relative group">
                                        <div className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all duration-1000" style={{height: `${h}%`}}></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] text-gray-400 uppercase">
                                <span>Lun</span><span>Dim</span>
                            </div>
                         </div>
                         
                         {/* Recent Sites */}
                         <div className="flex-[3] bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col">
                            <h3 className="font-bold text-sm text-gray-800 mb-4">Chantiers Récents</h3>
                            <div className="space-y-3">
                                {[
                                    { n: 'Rénovation Paris 16', s: 'En cours', c: 'bg-blue-100 text-blue-700' },
                                    { n: 'Cuisine M. Martin', s: 'Terminé', c: 'bg-green-100 text-green-700' },
                                    { n: 'Villa des Pins', s: 'Retard', c: 'bg-red-100 text-red-700' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                                {item.n.charAt(0)}
                                            </div>
                                            <div className="text-xs font-bold text-gray-700">{item.n}</div>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.c}`}>{item.s}</span>
                                    </div>
                                ))}
                            </div>
                         </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF --- */}
      <section className="py-10 border-y border-gray-100 bg-gray-50/50">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">Plus de 500 artisans et PME nous font confiance</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Mock Logos */}
               {['BATI PRO', 'CONSTRUCT', 'HEXA GONE', 'URBANIA', 'RENOV ECO'].map((brand, i) => (
                  <span key={i} className="text-2xl font-heading font-black text-gray-800 cursor-default tracking-tighter">{brand}</span>
               ))}
            </div>
         </div>
      </section>

      {/* --- PAIN POINTS (Avant/Après) --- */}
      <section id="benefits" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutralDark mb-4">Arrêtez de jongler avec le chaos</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Votre métier c'est de construire, pas de passer vos soirées sur l'administratif.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
             {/* THE OLD WAY */}
             <div className="bg-red-50/50 p-8 rounded-3xl border border-red-100 relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-red-200 group-hover:text-red-300 transition-colors">
                   <FileSpreadsheet size={120} />
                </div>
                <h3 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-3">
                   <span className="bg-red-100 p-2 rounded-lg"><X className="text-red-600" /></span>
                   Avant REVO
                </h3>
                <ul className="space-y-4 relative z-10">
                   {['Fichiers Excel éparpillés', 'Oublis de facturation', 'Planning dans la tête', 'Photos perdues dans WhatsApp', 'Soirées passées sur les devis'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-red-800 font-medium">
                         <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div> {item}
                      </li>
                   ))}
                </ul>
             </div>

             {/* THE NEW WAY */}
             <div className="bg-primary p-8 rounded-3xl text-white shadow-2xl shadow-primary/20 relative overflow-hidden group transform md:-translate-y-4 transition-transform">
                <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-colors"></div>
                <div className="absolute bottom-0 left-0 p-20 bg-accent/20 rounded-full -ml-10 -mb-10 blur-xl"></div>
                
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 relative z-10">
                   <span className="bg-white/20 p-2 rounded-lg backdrop-blur-sm"><Check className="text-accent" /></span>
                   Avec REVO
                </h3>
                <ul className="space-y-4 relative z-10">
                   {[
                      'Tout centralisé au même endroit', 
                      'Planning clair et partagé', 
                      'Accès hors-ligne sur chantier',
                      'Rentabilité calculée en temps réel'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 font-medium text-lg">
                         <CheckCircle className="text-accent shrink-0" size={20} /> {item}
                      </li>
                   ))}
                </ul>
             </div>
          </div>
        </div>
      </section>

      {/* --- BENTO GRID FEATURES --- */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutralDark mb-4">Conçu pour le terrain</h2>
                <p className="text-gray-500 max-w-xl text-lg">Chaque fonctionnalité a été pensée pour gagner du temps sur chantier et au bureau.</p>
              </div>
              <Button variant="secondary" onClick={() => navigate('/login')}>Découvrir toutes les fonctions</Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-rows-[auto_auto]">
              
              {/* Feature 1: Planning (Large) */}
              <Card className="md:col-span-2 p-8 bg-white border-none shadow-lg hover:shadow-xl transition-shadow flex flex-col md:flex-row gap-8 items-center overflow-hidden relative group">
                 <div className="flex-1 z-10">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                       <Calendar size={24} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Planning Collaboratif</h3>
                    <p className="text-gray-500 leading-relaxed">Assignez vos équipes par simple glisser-déposer. Vos gars reçoivent leur planning directement sur leur téléphone.</p>
                 </div>
                 <div className="flex-1 bg-gray-50 rounded-xl border border-gray-100 p-4 w-full transform rotate-3 translate-x-4 translate-y-4 group-hover:rotate-0 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 shadow-inner">
                    {/* Fake Calendar UI */}
                    <div className="grid grid-cols-3 gap-2">
                       <div className="bg-white p-2 rounded shadow-sm text-xs border border-gray-100"><div className="font-bold text-blue-600">Chantier A</div><div className="text-gray-400">08:00 - 17:00</div></div>
                       <div className="bg-white p-2 rounded shadow-sm text-xs border border-gray-100"><div className="font-bold text-orange-600">Chantier B</div><div className="text-gray-400">08:00 - 12:00</div></div>
                       <div className="bg-blue-50 p-2 rounded shadow-sm text-xs border border-blue-100"><div className="font-bold text-blue-800">Chantier C</div><div className="text-blue-400">En cours</div></div>
                    </div>
                 </div>
              </Card>

              {/* Feature 2: Mobile (Tall) */}
              <Card className="md:row-span-2 bg-neutralDark text-white p-8 border-none shadow-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                 <div className="relative z-10 h-full flex flex-col">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-sm">
                       <Smartphone size={24} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">100% Mobile & Hors-ligne</h3>
                    <p className="text-gray-400 leading-relaxed mb-8">Pas de réseau au sous-sol ? Pas de problème. Travaillez hors-ligne, tout se synchronise quand vous retrouvez la 4G.</p>
                    
                    <div className="mt-auto mx-auto w-48 bg-gray-800 rounded-3xl border-4 border-gray-700 p-2 shadow-2xl">
                       <div className="bg-gray-900 rounded-2xl h-64 w-full flex items-center justify-center text-gray-500 text-xs relative overflow-hidden">
                          <div className="absolute top-4 left-4 right-4 space-y-2">
                             <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                             <div className="h-20 bg-gray-800 rounded w-full border border-gray-700"></div>
                             <div className="h-20 bg-gray-800 rounded w-full border border-gray-700"></div>
                          </div>
                          <div className="absolute bottom-4 bg-primary text-white text-[10px] px-3 py-1 rounded-full flex items-center gap-1">
                             <Zap size={10} fill="currentColor"/> Mode Hors-ligne
                          </div>
                       </div>
                    </div>
                 </div>
              </Card>

              {/* Feature 3: AI (Normal) */}
              <Card className="p-8 bg-white border-none shadow-lg hover:shadow-xl transition-shadow group">
                 <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:rotate-12 transition-transform">
                    <Zap size={24} />
                 </div>
                 <h3 className="text-xl font-bold mb-3">Assistant IA</h3>
                 <p className="text-gray-500 text-sm">REVO rédige vos checklists sécurité et vos emails clients automatiquement.</p>
              </Card>

              {/* Feature 4: CRM (Normal) */}
              <Card className="p-8 bg-white border-none shadow-lg hover:shadow-xl transition-shadow group">
                 <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:rotate-12 transition-transform">
                    <Users size={24} />
                 </div>
                 <h3 className="text-xl font-bold mb-3">Suivi Client</h3>
                 <p className="text-gray-500 text-sm">Un mini CRM pour ne jamais oublier de relancer un devis ou d'envoyer une facture.</p>
              </Card>

           </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-24 bg-white border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-center mb-16">Approuvé par le terrain</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { name: "Thomas D.", role: "Plombier Chauffagiste", txt: "Je gagne environ 4h par semaine sur l'administratif. C'est simple, je ne rentre plus le soir pour faire mes papiers." },
                  { name: "Sarah L.", role: "Gérante Rénov'Est", txt: "L'équipe adore l'appli mobile. Ils ont toutes les infos du chantier, l'adresse Waze et les plans directement dans la poche." },
                  { name: "Marc P.", role: "Électricien", txt: "Le mode hors-ligne m'a sauvé la vie plusieurs fois. Et l'IA pour générer les checklists, c'est bluffant." }
               ].map((t, i) => (
                  <div key={i} className="bg-gray-50 p-8 rounded-2xl relative">
                     <div className="flex text-accent mb-4">
                        {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                     </div>
                     <p className="text-gray-600 italic mb-6">"{t.txt}"</p>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                           {t.name.charAt(0)}
                        </div>
                        <div>
                           <div className="font-bold text-neutralDark">{t.name}</div>
                           <div className="text-xs text-gray-400">{t.role}</div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 bg-neutralDark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        {/* Decorative Circles */}
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-accent/10 rounded-full blur-[100px] opacity-60"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Prêt à digitaliser votre activité ?</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Rejoignez REVO aujourd'hui. Sans engagement, sans carte bancaire.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-accent text-neutralDark hover:bg-accent/90 border-none font-bold text-lg px-8 py-6 h-auto" onClick={() => navigate('/login')}>
               Créer mon compte gratuit
            </Button>
            <Button size="lg" variant="ghost" className="text-white border-white/20 hover:bg-white/10 text-lg px-8 py-6 h-auto" onClick={() => navigate('/login')}>
               Réserver une démo
            </Button>
          </div>
          <p className="mt-8 text-sm text-gray-500 flex items-center justify-center gap-2">
            <ShieldCheck size={16} /> Données sécurisées & hébergées en France
          </p>
        </div>
      </section>
      
      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">R</span>
             </div>
             <span className="font-bold text-neutralDark text-lg">REVO</span>
          </div>
          <p className="text-sm text-gray-500">© 2024 REVO SAS. Fait avec ❤️ pour le BTP.</p>
          <div className="flex gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-primary transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-primary transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
