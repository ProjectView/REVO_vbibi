
import React, { useState } from 'react';
import { Card, Badge, Input, Button } from '../components/ui/Common';
import { Modal } from '../components/ui/Modal';
import { SidePanel } from '../components/ui/SidePanel';
import { STATUS_COLORS } from '../constants';
import { Site } from '../types';
import { Search, Filter, Plus, MapPin, Calendar, Users, FileText, AlertTriangle, Loader2 } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';
import { useLimitCheck } from '../hooks/useLimitCheck';

export const SitesList = () => {
  const { data: sites, loading, add, remove, update } = useFirestore<Site>('sites');
  const { isAtLimit } = useLimitCheck(sites);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [activeTab, setActiveTab] = useState<'infos' | 'checklist' | 'photos'>('infos');

  // Form State
  const [newSiteData, setNewSiteData] = useState({
     name: '', client: '', address: '', startDate: '', endDate: '', budget: '', description: ''
  });

  const handleCreateSite = async () => {
    if (!newSiteData.name) return;
    const randomLat = 48.85 + (Math.random() - 0.5) * 0.5;
    const randomLng = 2.35 + (Math.random() - 0.5) * 0.5;
    await add({
       ...newSiteData,
       status: 'Nouveau',
       budget: Number(newSiteData.budget),
       progress: 0,
       clientId: 'temp-id',
       lat: randomLat,
       lng: randomLng
    } as any);
    setIsModalOpen(false);
    setNewSiteData({ name: '', client: '', address: '', startDate: '', endDate: '', budget: '', description: '' });
  };

  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input placeholder="Rechercher un chantier..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="secondary"><Filter size={18} /> Filtres</Button>
          <Button onClick={() => setIsModalOpen(true)}><Plus size={18} /> Nouveau</Button>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#E1F2EC] text-primary">
              <tr>
                <th className="px-6 py-4 font-semibold text-sm">Nom</th>
                <th className="px-6 py-4 font-semibold text-sm">Client</th>
                <th className="px-6 py-4 font-semibold text-sm">Dates</th>
                <th className="px-6 py-4 font-semibold text-sm">Budget</th>
                <th className="px-6 py-4 font-semibold text-sm">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSites.map((site) => {
                const hasLimitConflict = isAtLimit(site);
                return (
                  <tr 
                    key={site.id} 
                    className={`hover:bg-gray-50 transition-colors group cursor-pointer ${hasLimitConflict ? 'bg-red-50/30' : ''}`}
                    onClick={() => setSelectedSite(site)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         {hasLimitConflict && <AlertTriangle size={14} className="text-danger animate-pulse" />}
                         <div className="font-medium text-neutralDark">{site.name}</div>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={10}/> {site.address}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{site.client}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{new Date(site.startDate).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">au {new Date(site.endDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{site.budget?.toLocaleString()} €</td>
                    <td className="px-6 py-4">
                      <Badge className={STATUS_COLORS[site.status] || 'bg-gray-100'}>{site.status}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <SidePanel isOpen={!!selectedSite} onClose={() => setSelectedSite(null)} title={selectedSite?.name || ''}>
        {selectedSite && (
          <div className="space-y-6">
            <div className={`p-4 rounded-xl bg-white border border-gray-100 shadow-sm ${isAtLimit(selectedSite) ? 'limit-halo' : ''}`}>
               <div className="flex justify-between items-start">
                  <div>
                    <Badge className={STATUS_COLORS[selectedSite.status]}>{selectedSite.status}</Badge>
                    <h2 className="text-2xl font-bold mt-2">{selectedSite.name}</h2>
                    {isAtLimit(selectedSite) && (
                      <div className="flex items-center gap-2 text-danger text-sm font-bold mt-1">
                        <AlertTriangle size={14} /> Capacité maximale atteinte sur cette période
                      </div>
                    )}
                  </div>
               </div>
            </div>
            {/* ... Rest of Details ... */}
          </div>
        )}
      </SidePanel>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau Chantier">
        <div className="space-y-4">
          <Input label="Nom" value={newSiteData.name} onChange={e => setNewSiteData({...newSiteData, name: e.target.value})} />
          <Input label="Client" value={newSiteData.client} onChange={e => setNewSiteData({...newSiteData, client: e.target.value})} />
          <Input label="Adresse" value={newSiteData.address} onChange={e => setNewSiteData({...newSiteData, address: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Début" type="date" value={newSiteData.startDate} onChange={e => setNewSiteData({...newSiteData, startDate: e.target.value})} />
            <Input label="Fin" type="date" value={newSiteData.endDate} onChange={e => setNewSiteData({...newSiteData, endDate: e.target.value})} />
          </div>
          <Button className="w-full" onClick={handleCreateSite}>Créer</Button>
        </div>
      </Modal>
    </div>
  );
};
