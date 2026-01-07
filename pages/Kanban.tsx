
import React, { useState } from 'react';
import { Site } from '../types';
import { MoreHorizontal, Plus, Settings2, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Common';
import { StatusManagerModal, ColumnConfig } from '../components/ui/StatusManagerModal';
import { useFirestore } from '../hooks/useFirestore';
import { useLimitCheck } from '../hooks/useLimitCheck';

const INITIAL_COLUMNS: ColumnConfig[] = [
  { id: 'c1', title: 'Nouveau', colorTheme: 'blue' },
  { id: 'c2', title: 'En cours', colorTheme: 'orange' },
  { id: 'c3', title: 'En révision', colorTheme: 'purple' },
  { id: 'c4', title: 'Terminé', colorTheme: 'green' },
];

const THEME_STYLES = {
  blue: { dot: 'bg-blue-500', border: 'border-blue-200', text: 'text-blue-700', bg: 'bg-blue-50' },
  green: { dot: 'bg-green-500', border: 'border-green-200', text: 'text-green-700', bg: 'bg-green-50' },
  orange: { dot: 'bg-orange-500', border: 'border-orange-200', text: 'text-orange-700', bg: 'bg-orange-50' },
  purple: { dot: 'bg-purple-500', border: 'border-purple-200', text: 'text-purple-700', bg: 'bg-purple-50' },
  red: { dot: 'bg-red-500', border: 'border-red-200', text: 'text-red-700', bg: 'bg-red-50' },
  gray: { dot: 'bg-gray-500', border: 'border-gray-200', text: 'text-gray-700', bg: 'bg-gray-50' },
};

export const Kanban = () => {
  const { data: sites, loading, update } = useFirestore<Site>('sites');
  const { isAtLimit } = useLimitCheck(sites);
  
  const [columns, setColumns] = useState<ColumnConfig[]>(INITIAL_COLUMNS);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  
  const { addToast } = useToast();

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.setData('siteId', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, columnTitle: string) => {
    e.preventDefault();
    const siteId = e.dataTransfer.getData('siteId');
    
    if (siteId) {
      await update(siteId, { status: columnTitle as any });
      addToast(`Statut mis à jour : ${columnTitle}`, 'success');
      setDraggingId(null);
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-lg font-bold text-neutralDark">Workflow Chantiers</h2>
        <div className="flex gap-2">
           <Button variant="secondary" size="sm" onClick={() => setIsManageModalOpen(true)} className="flex items-center gap-2">
             <Settings2 size={16} /> Gérer les statuts
           </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-6 h-full min-w-[1000px]">
          {columns.map(col => {
            const columnSites = sites.filter(s => s.status === col.title);
            const theme = THEME_STYLES[col.colorTheme];
            const totalBudget = columnSites.reduce((sum, site) => sum + (site.budget || 0), 0);
            
            return (
              <div 
                key={col.id} 
                className="flex-1 flex flex-col min-w-[280px] bg-gray-100 rounded-xl max-h-full transition-colors"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.title)}
              >
                {/* Column Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl z-10 sticky top-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${theme.dot}`}></div>
                      <h3 className="font-bold text-neutralDark">{col.title}</h3>
                      <span className="bg-white text-gray-600 text-xs px-2 py-0.5 rounded-full border border-gray-200">{columnSites.length}</span>
                    </div>
                  </div>
                  
                  <div className={`flex justify-between items-center px-3 py-2 rounded-lg ${theme.bg} border ${theme.border}`}>
                     <span className={`text-xs font-semibold ${theme.text} uppercase tracking-wide`}>Budget Total</span>
                     <span className={`font-bold ${theme.text}`}>{totalBudget.toLocaleString()} €</span>
                  </div>
                </div>

                {/* Column Content */}
                <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                  {columnSites.map(site => {
                    const hasLimitConflict = isAtLimit(site);
                    return (
                      <div 
                        key={site.id} 
                        className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group relative ${draggingId === site.id ? 'opacity-50 rotate-3 scale-95' : ''} ${hasLimitConflict ? 'limit-halo' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, site.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-gray-400 font-mono">#{site.id.substring(0,6)}</span>
                          {hasLimitConflict && <AlertTriangle size={14} className="text-danger animate-pulse" />}
                        </div>
                        <h4 className="font-semibold text-neutralDark mb-1">{site.name}</h4>
                        <p className="text-sm text-gray-500 mb-3">{site.client}</p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex -space-x-1.5">
                            <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] flex items-center justify-center border border-white">TM</div>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded ${new Date(site.endDate) < new Date() ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'}`}>
                            {new Date(site.endDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Column Footer Action */}
                <div className="p-3 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                  <button className="w-full py-2 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium">
                    <Plus size={16} /> Ajouter
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <StatusManagerModal 
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        initialColumns={columns}
        onSave={(newCols) => {
          setColumns(newCols);
          addToast('Structure du Kanban mise à jour', 'success');
        }}
      />
    </div>
  );
};
