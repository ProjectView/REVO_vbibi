
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

interface AuthContextType {
  user: User | any | null;
  companyId: string | null;
  companyData: any | null;
  loading: boolean;
  logout: () => Promise<void>;
  loginAsDemo: () => void;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  companyId: null, 
  companyData: null,
  loading: true, 
  logout: async () => {},
  loginAsDemo: () => {},
  authError: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | any | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const loginAsDemo = () => {
    localStorage.setItem('revo_demo_mode', 'true');
    setUser({
      uid: 'demo-user-123',
      email: 'demo@revo.app',
      displayName: 'Utilisateur Démo',
      photoURL: '',
      emailVerified: true
    });
    setCompanyId('demo-company-id');
    setCompanyData({
      name: 'Ma Société (Mode Local)',
      simultaneousLimit: Number(localStorage.getItem('revo_local_limit')) || 3
    });
    setAuthError(null);
    setLoading(false);
  };

  useEffect(() => {
    const isDemoMode = localStorage.getItem('revo_demo_mode') === 'true';

    if (isDemoMode) {
      loginAsDemo();
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthError(null);

      if (currentUser) {
        const offlineCompanyId = `offline_${currentUser.uid}`;

        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          let userSnapshot;
          
          try {
             userSnapshot = await getDoc(userDocRef);
          } catch (e: any) {
             console.warn("AuthContext: Failed to fetch user profile.", e.code);
             if (e.code === 'permission-denied') setAuthError('permission-denied');
             setCompanyId(offlineCompanyId);
             setLoading(false);
             return;
          }

          if (userSnapshot && userSnapshot.exists()) {
            const uData = userSnapshot.data();
            const cId = uData.companyId;
            setCompanyId(cId);

            // Listen to real-time company data updates
            onSnapshot(doc(db, 'companies', cId), (snap) => {
              if (snap.exists()) {
                setCompanyData(snap.data());
              }
            });

          } else {
            const newCompanyId = `comp_${currentUser.uid}`; 
            await setDoc(userDocRef, {
              email: currentUser.email,
              displayName: currentUser.displayName || '',
              companyId: newCompanyId,
              role: 'admin',
              createdAt: serverTimestamp()
            });
            await setDoc(doc(db, 'companies', newCompanyId), {
              name: 'Ma Société',
              ownerId: currentUser.uid,
              simultaneousLimit: 3,
              createdAt: serverTimestamp(),
              plan: 'free'
            });
            setCompanyId(newCompanyId);
          }
        } catch (error) {
          console.error("Erreur globale AuthContext:", error);
          setCompanyId(offlineCompanyId);
        }
      } else {
        setCompanyId(null);
        setCompanyData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    localStorage.removeItem('revo_demo_mode');
    try { await firebaseSignOut(auth); } catch (e) { }
    setUser(null);
    setCompanyId(null);
    setCompanyData(null);
    setAuthError(null);
    window.location.href = '/'; 
  };

  return (
    <AuthContext.Provider value={{ user, companyId, companyData, loading, logout, loginAsDemo, authError }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
