import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { MOCK_SITES, MOCK_CLIENTS, MOCK_LEADS, MOCK_TEMPLATES, MOCK_TEAMS } from '../constants';

// Mapping table for mock data
const MOCK_DATA: Record<string, any[]> = {
  sites: MOCK_SITES,
  clients: MOCK_CLIENTS,
  leads: MOCK_LEADS,
  templates: MOCK_TEMPLATES,
  teams: MOCK_TEAMS
};

// Local storage helper
const getLocalData = (key: string, defaultData: any[]) => {
  try {
    const stored = localStorage.getItem(`revo_mock_${key}`);
    return stored ? JSON.parse(stored) : defaultData;
  } catch (e) {
    return defaultData;
  }
};

const setLocalData = (key: string, data: any[]) => {
  localStorage.setItem(`revo_mock_${key}`, JSON.stringify(data));
};

export const useFirestore = <T extends { id: string }>(collectionName: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, companyId } = useAuth();
  const { addToast } = useToast();
  
  // Check if we are in demo mode explicitly or forced
  const isDemoMode = localStorage.getItem('revo_demo_mode') === 'true';

  useEffect(() => {
    // --- OPTIMISATION HORS-LIGNE / DÉMO ---
    if (isDemoMode || (companyId && (companyId.startsWith('offline_') || companyId.startsWith('demo-')))) {
      const mockInitial = MOCK_DATA[collectionName] || [];
      const localData = getLocalData(collectionName, mockInitial);
      setData(localData as T[]);
      setLoading(false);
      return;
    }

    // Normal Firebase Mode check
    if (!user || !companyId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const q = query(
        collection(db, collectionName),
        where('companyId', '==', companyId)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const results = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        
        setData(results);
        setLoading(false);
      }, (error: any) => {
        console.warn(`Firestore Error (${collectionName}):`, error);
        
        // --- FALLBACK AUTOMATIC ---
        // Handle Datastore Mode error (failed-precondition) and others
        if (
          error.code === 'not-found' || 
          error.message?.includes('does not exist') || 
          error.code === 'unavailable' || 
          error.code === 'permission-denied' ||
          error.code === 'failed-precondition' || // Datastore Mode mismatch
          error.code === 'unimplemented'
        ) {
           // Load from Local Storage (preserving user creations)
           const mockInitial = MOCK_DATA[collectionName] || [];
           const localData = getLocalData(collectionName, mockInitial);
           setData(localData as T[]);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Setup Error:", err);
      const mockInitial = MOCK_DATA[collectionName] || [];
      const localData = getLocalData(collectionName, mockInitial);
      setData(localData as T[]);
      setLoading(false);
    }
  }, [user, companyId, collectionName, isDemoMode]);

  const add = async (docData: Omit<T, 'id'>) => {
    // Mode Démo ou Offline forcé
    if (isDemoMode || (companyId && companyId.startsWith('offline_'))) {
       const newItem = { id: `local_${Date.now()}`, ...docData };
       const newData = [...data, newItem];
       setData(newData as T[]);
       setLocalData(collectionName, newData);
       addToast("Élément ajouté (Local)", "success");
       return;
    }

    if (!user || !companyId) return;
    try {
      await addDoc(collection(db, collectionName), {
        ...docData,
        companyId: companyId,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      addToast("Élément ajouté avec succès", "success");
    } catch (err: any) {
      console.error("Add failed, falling back to local:", err);
      const newItem = { id: `local_${Date.now()}`, ...docData };
      const newData = [...data, newItem];
      setData(newData as T[]);
      setLocalData(collectionName, newData);
      
      const msg = err.code === 'permission-denied' ? "Permissions manquantes (Mode Local)" : "Ajouté localement (Mode Hors-ligne)";
      addToast(msg, "info");
    }
  };

  const update = async (id: string, docData: Partial<T>) => {
    if (isDemoMode || id.startsWith('local_') || id.startsWith('mock_') || (companyId && companyId.startsWith('offline_'))) {
       const newData = data.map(item => item.id === id ? { ...item, ...docData } : item);
       setData(newData);
       setLocalData(collectionName, newData);
       return;
    }

    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...docData,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Update failed:", err);
      const newData = data.map(item => item.id === id ? { ...item, ...docData } : item);
      setData(newData);
      setLocalData(collectionName, newData);
      addToast("Modifié localement (Mode Hors-ligne)", "info");
    }
  };

  const remove = async (id: string) => {
    if (isDemoMode || id.startsWith('local_') || id.startsWith('mock_') || (companyId && companyId.startsWith('offline_'))) {
       const newData = data.filter(item => item.id !== id);
       setData(newData);
       setLocalData(collectionName, newData);
       addToast("Élément supprimé (Local)", "success");
       return;
    }

    try {
      await deleteDoc(doc(db, collectionName, id));
      addToast("Élément supprimé", "success");
    } catch (err) {
      console.error("Delete failed:", err);
      const newData = data.filter(item => item.id !== id);
      setData(newData);
      setLocalData(collectionName, newData);
      addToast("Supprimé localement (Mode Hors-ligne)", "info");
    }
  };

  return { data, loading, add, update, remove };
};