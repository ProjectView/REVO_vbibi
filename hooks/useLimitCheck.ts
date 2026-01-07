
import { useAuth } from '../contexts/AuthContext';
import { Site } from '../types';

export const useLimitCheck = (allSites: Site[]) => {
  const { companyData } = useAuth();
  const limit = companyData?.simultaneousLimit || 0;

  /**
   * Retourne le nombre de chantiers actifs à une date donnée.
   */
  const getCountOnDate = (date: Date) => {
    const checkTime = new Date(date).setHours(0, 0, 0, 0);
    return allSites.filter(s => {
      // On ignore les chantiers archivés ou terminés (si vous considérez que Terminé libère de la place)
      // Ici on garde 'Archivé' comme filtre principal de sortie
      if (s.status === 'Archivé') return false;
      
      const sStart = new Date(s.startDate).setHours(0, 0, 0, 0);
      const sEnd = new Date(s.endDate).setHours(23, 59, 59, 999);
      
      return checkTime >= sStart && checkTime <= sEnd;
    }).length;
  };

  /**
   * Vérifie si la limite est atteinte pour une date spécifique.
   */
  const isLimitReachedOnDate = (date: Date) => {
    if (!limit || limit <= 0) return false;
    return getCountOnDate(date) >= limit;
  };

  /**
   * Version utilisée pour les cartes (Dashboard, Kanban, Liste).
   * Renvoie vrai UNIQUEMENT si le chantier est en conflit AUJOURD'HUI.
   */
  const isAtLimit = (site: Site) => {
    if (!limit || limit <= 0) return false;
    
    const today = new Date();
    const todayTime = today.setHours(0, 0, 0, 0);
    
    const sStart = new Date(site.startDate).setHours(0, 0, 0, 0);
    const sEnd = new Date(site.endDate).setHours(23, 59, 59, 999);
    
    // Si le chantier n'est pas actif aujourd'hui, pas de halo sur la carte
    if (todayTime < sStart || todayTime > sEnd) return false;
    
    // Sinon, on vérifie si la limite est atteinte aujourd'hui
    return getCountOnDate(today) >= limit;
  };

  return { isAtLimit, isLimitReachedOnDate, getCountOnDate, limit };
};
