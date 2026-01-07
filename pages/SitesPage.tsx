
import React, { useState } from 'react';
import { SitesList } from './SitesList';
import { Kanban } from './Kanban';
import { MapPage } from './MapPage';
import { List, Trello, Map as MapIcon } from 'lucide-react';

export const SitesPage = () => {
  // Changement de la vue par défaut de 'list' à 'kanban'
  const [view, setView] = useState<'list' | 'kanban' | 'map'>('kanban');

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
            <h2 className="text-2xl font-bold font-heading text-neutralDark">Gestion des Chantiers</h2>
            <p className="text-gray-500">Vue d'ensemble et suivi de production.</p>
         </div>

         {/* View Switcher */}
         <div className="bg-gray-100 p-1 rounded-xl flex items-center">
            <button
               onClick={() => setView('list')}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === 'list' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
               }`}
            >
               <List size={18} />
               Liste
            </button>
            <button
               onClick={() => setView('kanban')}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === 'kanban' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-gray-700'
               }`}
            >
               <Trello size={18} />
               Kanban
            </button>
            <button
               onClick={() => setView('map')}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === 'map' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
               }`}
            >
               <MapIcon size={18} />
               Carte
            </button>
         </div>
      </div>

      <div className="flex-1 min-h-0 relative">
         {view === 'list' && <SitesList />}
         {view === 'kanban' && <Kanban />}
         {view === 'map' && <MapPage />}
      </div>
    </div>
  );
};
