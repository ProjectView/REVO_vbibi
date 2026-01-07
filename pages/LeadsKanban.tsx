
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lead, Site } from '../types';
import { MoreHorizontal, Euro, Settings2, Plus, Loader2 } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { SidePanel } from '../components/ui/SidePanel';
import { Modal } from '../components/ui/Modal';
import { Button, Badge, Input } from '../components/ui/Common';
import { StatusManagerModal, ColumnConfig } from '../components/ui/StatusManagerModal';
import { useFirestore } from '../hooks/useFirestore';

const INITIAL_COLUMNS: ColumnConfig[] = [
  { id: 'l1', title: 'Nouveau', colorTheme: 'blue' },
  { id: 'l2', title: 'Qualifié', colorTheme: 'purple' },
  { id: 'l3', title: 'Devis envoyé', colorTheme: 'orange' },
  { id: 'l4', title: 'Négociation', colorTheme: 'orange' },
  { id: 'l5', title: 'Gagné', colorTheme: 'green' },
  { id: 'l6', title: 'Perdu', colorTheme: 'red' },
];

const THEME_STYLES = {
  blue: { dot: 'bg-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700' },
  green: { dot: 'bg-green-500', bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-700' },
  orange: { dot: 'bg-orange-500', bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-700' },
  purple: { dot: 'bg-purple-500', bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700' },
  red: { dot: 'bg-red-500', bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700' },
  gray: { dot: 'bg-gray-500', bg: 'bg-gray-50', border: 'border-gray-100', text: 'text-gray-700' },
};

export const LeadsKanban = () => {
  const navigate = useNavigate();
  const { data: leads, loading, add, update } = useFirestore<Lead>('leads');
  const { add: addSite } = useFirestore<Site>('sites');
  
  const [columns, setColumns] = useState<ColumnConfig[]>(INITIAL_COLUMNS);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const { addToast } = useToast();

  // Create Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ contactName: '', projectType: '', estimatedBudget: '' });

  // Conversion Modal
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);
  const [conversionData, setConversionData] = useState({ startDate: '', endDate: '', address: 'Paris, France' });

  const handleCreateLead = async () => {
     if(!newLead.contactName) return;
     await add({
        contactName: newLead.contactName,
        projectType: newLead.projectType || 'Projet',
        estimatedBudget: Number(newLead.estimatedBudget),
        status: 'Nouveau',
        email: '',
        phone: '',
        source: 'Manuel',
        createdAt: new Date().toISOString()
     } as any);
     setIsCreateModalOpen(false);
     setNewLead({ contactName: '', projectType: '', estimatedBudget: '' });
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.setData('leadId', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    const lead = leads.find(l => l.id === leadId);
    
    if (lead) {
      if (status === 'Gagné') {
         setLeadToConvert(lead);
         setIsConversionModalOpen(true);
         setDraggingId(null);
         return; 
      }
      await update(leadId, { status: status as any });
      addToast(`Statut mis à jour : ${status}`, status === 'Perdu' ? 'error' : 'info');
      setDraggingId(null);
    }
  };

  const confirmConversion = async () => {
     if (!leadToConvert) return;

     try {
       // 1. Create Site using Hook
       await addSite({
          name: `${leadToConvert.projectType} - ${leadToConvert.contactName}`,
          client: leadToConvert.contactName, 
          address: conversionData.address,
          status: 'Nouveau',
          budget: leadToConvert.estimatedBudget,
          startDate: conversionData.startDate || new Date().toISOString(),
          endDate: conversionData.endDate || new Date(Date.now() + 86400000 * 30).toISOString(),
          description: `Chantier issu du prospect ${leadToConvert.contactName}.`,
          progress: 0,
          clientId: 'converted-lead',
          lat: 48.85,
          lng: 2.35
       });
       
       // 2. Update Lead
       await update(leadToConvert.id, { status: 'Gagné' });

       setIsConversionModalOpen(false);
       addToast("Félicitations ! Chantier créé avec succès.", "success");
       setTimeout(() => navigate('/sites'), 1000);

     } catch (e) {
       addToast("Erreur lors de la conversion", "error");
     }
  };

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-lg font-bold text-neutralDark">Suivi des opportunités</h2>
        <div className="flex gap-2">
           <Button size="sm" onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
             <Plus size={16} /> Nouveau Prospect
           </Button>
           <Button variant="secondary" size="sm" onClick={() => setIsManageModalOpen(true)} className="flex items-center gap-2">
             <Settings2 size={16} /> Gérer les étapes
           </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-6 h-full min-w-[1600px]">
          {columns.map(col => {
            const columnLeads = leads.filter(l => l.status === col.title);
            const theme = THEME_STYLES[col.colorTheme];
            const isLostColumn = col.title === 'Perdu';
            const totalBudget = columnLeads.reduce((sum, lead) => sum + (lead.estimatedBudget || 0), 0);
            
            return (
              <div 
                key={col.id} 
                className={`flex-1 flex flex-col min-w-[280px] rounded-xl max-h-full transition-colors ${isLostColumn ? 'bg-red-50' : 'bg-gray-100'}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.title)}
              >
                {/* Column Header */}
                <div className={`p-4 border-b border-gray-200 rounded-t-xl z-10 sticky top-0 ${isLostColumn ? 'bg-red-50' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${theme.dot}`}></div>
                    <h3 className="font-bold text-neutralDark">{col.title}</h3>
                    <span className="bg-white text-gray-600 text-xs px-2 py-0.5 rounded-full border border-gray-200">{columnLeads.length}</span>
                  </div>

                  <div className={`flex justify-between items-center px-3 py-2 rounded-lg bg-white border ${theme.border} shadow-sm`}>
                     <span className={`text-xs font-semibold ${theme.text} uppercase tracking-wide`}>Estimé</span>
                     <span className={`font-bold ${theme.text}`}>{totalBudget.toLocaleString()} €</span>
                  </div>
                </div>

                {/* Column Content */}
                <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                  {columnLeads.map(lead => (
                    <div 
                      key={lead.id} 
                      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group ${draggingId === lead.id ? 'opacity-50 rotate-3 scale-95' : ''} ${lead.status === 'Perdu' ? 'opacity-70 grayscale' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-primary font-bold px-2 py-0.5 bg-secondary rounded-full">{lead.projectType}</span>
                        <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600"><MoreHorizontal size={16}/></button>
                      </div>
                      
                      <h4 className={`font-semibold text-neutralDark ${lead.status === 'Perdu' ? 'line-through' : ''}`}>{lead.contactName}</h4>
                      
                      <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                         <Euro size={14} className="text-gray-400"/>
                         <span className="font-medium">{lead.estimatedBudget?.toLocaleString()} €</span>
                      </div>
                    </div>
                  ))}
                  
                   {/* Column Footer Action */}
                   <div className="pt-2">
                     <button onClick={() => setIsCreateModalOpen(true)} className="w-full py-2 flex items-center justify-center gap-2 text-gray-400 hover:bg-black/5 rounded-lg transition-colors text-sm font-medium border border-transparent hover:border-gray-200">
                        <Plus size={16} /> Ajouter
                     </button>
                   </div>
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
          addToast('Pipeline commercial mis à jour', 'success');
        }}
      />

      <SidePanel isOpen={!!selectedLead} onClose={() => setSelectedLead(null)} title="Détail du Prospect">
        {selectedLead && (
           <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutralDark">{selectedLead.contactName}</h2>
              <Badge className="bg-primary text-white border-transparent mt-2">{selectedLead.status}</Badge>
              <div className="text-2xl font-bold text-primary">{selectedLead.estimatedBudget?.toLocaleString()} €</div>
              <p>Email: {selectedLead.email}</p>
           </div>
        )}
      </SidePanel>

      {/* Modal New Lead */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Nouveau Prospect" footer={<Button onClick={handleCreateLead}>Créer</Button>}>
         <div className="space-y-4">
            <Input label="Nom du contact" value={newLead.contactName} onChange={e => setNewLead({...newLead, contactName: e.target.value})} placeholder="M. Dupont" />
            <Input label="Type de projet" value={newLead.projectType} onChange={e => setNewLead({...newLead, projectType: e.target.value})} placeholder="Rénovation" />
            <Input label="Budget estimé (€)" type="number" value={newLead.estimatedBudget} onChange={e => setNewLead({...newLead, estimatedBudget: e.target.value})} />
         </div>
      </Modal>

      {/* Modal Conversion */}
      <Modal isOpen={isConversionModalOpen} onClose={() => setIsConversionModalOpen(false)} title="Bravo ! Nouveau chantier" footer={<Button onClick={confirmConversion}>Valider</Button>}>
         <div className="space-y-4">
            <p>Convertir <strong>{leadToConvert?.contactName}</strong> en client.</p>
            <Input label="Adresse" value={conversionData.address} onChange={e => setConversionData({...conversionData, address: e.target.value})} />
            <Input label="Date début" type="date" value={conversionData.startDate} onChange={e => setConversionData({...conversionData, startDate: e.target.value})} />
         </div>
      </Modal>
    </div>
  );
};
