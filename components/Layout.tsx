
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Settings, 
  HardHat, 
  LogOut, 
  Menu, 
  X,
  CalendarDays,
  Target,
  Cloud,
  HardDrive,
  AlertTriangle,
  RefreshCw,
  ServerOff,
  Zap
} from 'lucide-react';
import { Button, Badge } from './ui/Common';
import { useAuth } from '../contexts/AuthContext';
import { getActiveSubscription } from '../services/axonautService';

interface LayoutProps {
  children: React.ReactNode;
}

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group font-medium ${
        isActive 
          ? 'bg-secondary text-primary shadow-sm' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
      }`
    }
  >
    <Icon size={20} className="transition-transform group-hover:scale-110" />
    <span>{label}</span>
  </NavLink>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, companyId, authError } = useAuth();
  
  const subscription = getActiveSubscription();
  const isPro = subscription.isPro;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/leads', icon: Target, label: 'Pipeline Commerciale' },
    { to: '/calendar', icon: CalendarDays, label: 'Calendrier' },
    { to: '/sites', icon: HardHat, label: 'Chantiers' },
    { to: '/clients', icon: Users, label: 'Clients' },
    { to: '/templates', icon: ClipboardList, label: 'Modèles IA' },
    { to: '/settings', icon: Settings, label: 'Société' },
  ];

  const getPageTitle = () => {
    const current = menuItems.find(item => item.to === location.pathname);
    if (location.pathname === '/profile') return 'Mon Profil';
    if (location.pathname === '/pricing') return 'Abonnement';
    return current ? current.label : 'REVO';
  };

  const isLocalMode = companyId?.startsWith('offline_') || companyId === 'demo-company-id' || localStorage.getItem('revo_demo_mode') === 'true';

  const handleRetryConnection = () => {
    window.location.reload();
  };

  const getStatusConfig = () => {
    if (!isLocalMode) {
      return { 
        icon: Cloud, 
        text: "Synchronisé", 
        className: "bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default" 
      };
    }
    
    if (authError === 'permission-denied') {
      return {
        icon: AlertTriangle,
        text: "Relancer la connexion (Règles MAJ)",
        className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 cursor-pointer animate-pulse"
      };
    }
    
    if (authError === 'configuration-error') {
      return {
        icon: ServerOff,
        text: "Config Firebase Invalide",
        className: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 cursor-pointer"
      };
    }

    return {
      icon: HardDrive,
      text: "Mode Local",
      className: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 cursor-pointer"
    };
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;

  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-white font-heading font-bold text-xl">R</span>
            </div>
            <span className="font-heading font-bold text-2xl text-neutralDark tracking-tight">REVO</span>
          </div>
          <button className="lg:hidden text-gray-500" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="px-4 py-2 flex flex-col gap-1 h-[calc(100vh-230px)] overflow-y-auto">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.to} 
              {...item} 
              onClick={() => setIsMobileMenuOpen(false)} 
            />
          ))}

          {/* Upgrade CTA */}
          {!isPro && (
             <div className="mt-4 p-4 bg-gradient-to-br from-neutralDark to-gray-800 rounded-xl text-white relative overflow-hidden group cursor-pointer" onClick={() => navigate('/pricing')}>
                <div className="absolute top-0 right-0 p-8 bg-white/5 rounded-full -mr-4 -mt-4 group-hover:bg-white/10 transition-colors"></div>
                <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-2">
                      <Zap size={16} className="text-accent fill-accent" />
                      <span className="font-bold text-sm">Passer Pro</span>
                   </div>
                   <p className="text-xs text-gray-300 mb-3 leading-relaxed">Débloquez l'IA et les chantiers illimités.</p>
                   <button className="w-full py-1.5 bg-white text-neutralDark text-xs font-bold rounded shadow-sm hover:bg-gray-100 transition-colors">
                      Voir les offres
                   </button>
                </div>
             </div>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-50 bg-white">
          <div 
            className="flex items-center gap-3 mb-4 px-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            onClick={() => {
              navigate('/profile');
              setIsMobileMenuOpen(false);
            }}
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white shadow-sm flex items-center justify-center text-gray-500 font-bold relative">
               {user?.photoURL ? (
                 <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
               ) : (
                 <span>{user?.displayName?.charAt(0) || 'U'}</span>
               )}
               {isPro && (
                  <div className="absolute -bottom-1 -right-1 bg-accent text-neutralDark text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-white">PRO</div>
               )}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-neutralDark truncate">{user?.displayName || 'Utilisateur'}</span>
              <span className="text-xs text-gray-500 truncate">{user?.email || 'admin@btp.pro'}</span>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-danger hover:bg-danger/10" onClick={handleLogout}>
            <LogOut size={18} className="mr-2" /> Déconnexion
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-100 p-4 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="font-bold text-lg">REVO</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600">
            <Menu size={24} />
          </button>
        </header>

        <header className="hidden lg:flex items-center justify-between px-8 py-6 bg-[#F8F9FA]">
          <h1 className="text-3xl font-heading font-bold text-neutralDark">{getPageTitle()}</h1>
          <div className="flex items-center gap-4">
             <button 
               onClick={isLocalMode ? handleRetryConnection : undefined}
               className={`text-xs font-medium px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-all duration-300 ${status.className}`} 
               title={isLocalMode ? "Cliquez pour réessayer la connexion au Cloud" : "Données synchronisées"}
             >
                <StatusIcon size={14} />
                {status.text}
                {isLocalMode && <RefreshCw size={12} className="ml-1 opacity-50" />}
             </button>

             <div className="flex -space-x-2 mr-4 ml-2">
               {[1,2,3].map(i => (
                 <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden" title={`User ${i}`}>
                   <img src={`https://i.pravatar.cc/100?img=${10+i}`} className="w-full h-full object-cover" />
                 </div>
               ))}
               <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">+2</div>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="w-full h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
