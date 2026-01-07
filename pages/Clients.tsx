
import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '../components/ui/Common';
import { SidePanel } from '../components/ui/SidePanel';
import { Modal } from '../components/ui/Modal';
import { STATUS_COLORS } from '../constants';
import { Client, Site } from '../types';
import { Search, Mail, Phone, MapPin, Plus, MoreVertical, Building2, Calendar, Edit, MessageCircle, Trash2, Loader2 } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';

export const Clients = () => {
  const { data: clients, loading, add, remove, update } = useFirestore<Client>('clients');
  const { data: sites } = useFirestore<Site>('sites'); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: 'Particulier',
    address: ''
  });

  const handleCreateClient = async () => {
    if (!newClient.name) return;
    await add({
      ...newClient,
      avatar: `https://ui-avatars.com/api/?name=${newClient.name}&background=random`
    } as any);
    setIsModalOpen(false);
    setNewClient({ name: '', email: '', phone: '', company: 'Particulier', address: '' });
  };

  const handleDeleteClient = async () => {
    if (selectedClient) {
      await remove(selectedClient.id);
      setSelectedClient(null);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientSites = (clientName: string) => {
    return sites.filter(s => s.client.toLowerCase() === clientName.toLowerCase() || s.clientId === selectedClient?.id);
  };

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold font-heading text-neutralDark">Clients</h2>
           <p className="text-gray-500">Gérez votre base de clients et leurs coordonnées.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Nouveau Client
        </Button>
      </div>

      <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
         <Input 
            placeholder="Rechercher par nom, entreprise..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={20} />}
            className="border-none bg-transparent focus:bg-transparent text-neutralDark"
            style={{ backgroundColor: 'transparent', color: '#222' }}
         />
         {/* Note: Here I keep the search bar slightly lighter for general UX, 
             but the 'Input' component inside cards/modals follows the dark theme. */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => (
          <Card 
            key={client.id} 
            className="group relative hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => setSelectedClient(client)}
          >
            <div className="flex flex-col items-center text-center mb-6">
               <div className="w-20 h-20 rounded-full bg-gray-200 mb-4 overflow-hidden border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300">
                  {client.avatar ? (
                     <img src={client.avatar} alt={client.name} className="w-full h-full object-cover" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center bg-primary text-white text-2xl font-bold">
                        {client.name.charAt(0)}
                     </div>
                  )}
               </div>
               <h3 className="font-bold text-lg text-neutralDark">{client.name}</h3>
               <span className="text-sm text-primary bg-secondary px-3 py-1 rounded-full mt-1 font-medium">{client.company}</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-50">
               <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  <span className="truncate">{client.email}</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone size={16} className="text-gray-400" />
                  <span>{client.phone}</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="truncate">{client.address}</span>
               </div>
            </div>

            <Button variant="secondary" className="w-full mt-6" size="sm">Voir Profil</Button>
          </Card>
        ))}
      </div>

      {/* SidePanel & Modals follow the dark Input theme automatically via Common.tsx */}
      <SidePanel isOpen={!!selectedClient} onClose={() => setSelectedClient(null)} title="Fiche Client">
        {selectedClient && (
           <div className="space-y-8 animate-in fade-in">
              <div className="flex items-center gap-5">
                 <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg">
                    {selectedClient.avatar ? (
                       <img src={selectedClient.avatar} alt={selectedClient.name} className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center bg-primary text-white text-3xl font-bold">
                          {selectedClient.name.charAt(0)}
                       </div>
                    )}
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-neutralDark">{selectedClient.name}</h3>
                    <p className="text-primary font-medium">{selectedClient.company}</p>
                 </div>
              </div>
              {/* ... reste du contenu ... */}
           </div>
        )}
      </SidePanel>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter un client">
         <div className="space-y-4">
            <Input label="Nom complet" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
            <Input label="Société" value={newClient.company} onChange={e => setNewClient({...newClient, company: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
               <Input label="Email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} />
               <Input label="Téléphone" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
            </div>
            <Input label="Adresse" multiline rows={2} value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} />
            <Button className="w-full mt-4" onClick={handleCreateClient}>Enregistrer</Button>
         </div>
      </Modal>
    </div>
  );
};
