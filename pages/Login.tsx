
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui/Common';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { AlertCircle, WifiOff, HardDrive } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';

export const Login = () => {
  const navigate = useNavigate();
  const { loginAsDemo } = useAuth();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLocalLogin = async () => {
    setLoading(true);
    // Use context method to update state synchronously without reloading the page
    await loginAsDemo();
    addToast("Mode local activé. Vos données sont sauvegardées sur cet appareil.", "success");
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 500);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard'); 
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      
      // Auto-fallback strategies
      if (err.code === 'auth/unauthorized-domain' || err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
        setError("Configuration Firebase incomplète. Bascule automatique en mode local...");
        setTimeout(() => handleLocalLogin(), 1500);
        return;
      }
      
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Connexion annulée.");
      } else {
        setError("Erreur de connexion. Essayez le 'Mode Local' ci-dessous.");
      }
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      
      // Common configuration errors handled by switching to local
      if (err.code === 'auth/operation-not-allowed') {
         setError("L'authentification Email n'est pas activée sur la console. Utilisez le Mode Local.");
         setLoading(false);
         return;
      }

      if (err.code === 'auth/network-request-failed' || err.code === 'auth/internal-error') {
         setError("Problème de connexion au serveur. Bascule automatique en mode local...");
         setTimeout(() => handleLocalLogin(), 1500);
         return;
      }

      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Email ou mot de passe incorrect.");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Trop de tentatives. Réessayez plus tard.");
      } else {
        setError("Une erreur est survenue : " + err.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center animate-in slide-in-from-top-4 duration-700">
        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
          <span className="text-white font-heading font-bold text-3xl">R</span>
        </div>
        <h1 className="text-4xl font-heading font-bold text-neutralDark tracking-tight">REVO</h1>
        <p className="text-gray-500 mt-2">La gestion de chantiers réinventée</p>
      </div>

      <Card className="w-full max-w-md p-8 animate-in zoom-in-95 duration-500 shadow-xl border-t-4 border-primary">
        <h2 className="text-xl font-bold mb-6 text-center">
          Connexion Espace Client
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-danger text-sm animate-in fade-in">
            <AlertCircle size={16} className="shrink-0 mt-0.5" /> 
            <span>{error}</span>
          </div>
        )}

        {/* Local Mode Button - High Visibility */}
        <button 
          type="button"
          onClick={handleLocalLogin}
          className="w-full flex items-center justify-center gap-3 bg-secondary text-primary border-2 border-primary/10 font-bold py-3 px-4 rounded-lg hover:bg-primary hover:text-white transition-all mb-6 group"
        >
          <HardDrive size={20} className="group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <div className="text-sm font-bold">Mode Local / Hors Ligne</div>
            <div className="text-[10px] font-normal opacity-80">Utiliser sans compte ni configuration Firebase</div>
          </div>
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou avec le cloud</span>
          </div>
        </div>

        <button 
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-lg transition-colors mb-4"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          <span>Continuer avec Google</span>
        </button>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <Input 
             label="Email professionnel" 
             type="email" 
             placeholder="nom@entreprise.com" 
             required
             value={email}
             onChange={e => setEmail(e.target.value)}
          />
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
               <label className="text-sm font-medium text-neutralDark">Mot de passe</label>
               <a href="#" className="text-xs text-primary hover:underline">Oublié ?</a>
            </div>
            <Input 
               type="password" 
               placeholder="••••••••" 
               required
               value={password}
               onChange={e => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" isLoading={loading}>
            Se connecter
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
          Pas encore de compte ? {" "}
          <button 
            onClick={() => navigate('/register')}
            className="text-primary font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            Créer un compte professionnel
          </button>
        </div>
      </Card>
      
      <div className="mt-8 text-xs text-gray-400 flex gap-4">
         <span className="flex items-center gap-1"><WifiOff size={12}/> Support hors-ligne actif</span>
         <span>•</span>
         <span>v1.0.3</span>
      </div>
    </div>
  );
};
