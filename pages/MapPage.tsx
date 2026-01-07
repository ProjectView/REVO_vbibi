
import React, { useState, useEffect } from 'react';
import { Badge, Button } from '../components/ui/Common';
import { SidePanel } from '../components/ui/SidePanel';
import { STATUS_COLORS } from '../constants';
import { Site } from '../types';
import { MapPin, Calendar, Users, FileText, Plus, Image as ImageIcon, Navigation, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

// Fix for default Leaflet icons
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export const MapPage = () => {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [activeTab, setActiveTab] = useState<'infos' | 'checklist' | 'photos'>('infos');
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  // Center map on France by default
  const defaultPosition: [number, number] = [46.603354, 1.888334];

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'sites'), (snapshot) => {
      // Filter sites that might have coordinates (simulated or real)
      // In a real app, you would use a geocoding API to get lat/lng from address
      // Here we map mock coordinates if missing, or use real ones
      const sitesData = snapshot.docs.map(doc => {
         const data = doc.data();
         // Fallback coordinates for demo purposes if not provided
         return { 
            id: doc.id, 
            ...data,
            lat: data.lat || (42 + Math.random() * 8),
            lng: data.lng || (-4 + Math.random() * 10)
         } as Site
      });
      setSites(sitesData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
     return <div className="h-full flex items-center justify-center bg-gray-50 rounded-xl"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  return (
    <div className="h-full relative rounded-xl overflow-hidden border border-gray-200 shadow-inner animate-in fade-in duration-500 bg-gray-50">
      
      {/* React Leaflet Map */}
      <MapContainer 
        center={defaultPosition} 
        zoom={6} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        <ZoomControl position="bottomright" />

        {sites.map((site) => (
          site.lat && site.lng ? (
            <Marker 
              key={site.id} 
              position={[site.lat, site.lng]}
              eventHandlers={{
                click: () => setSelectedSite(site),
              }}
            >
              <Popup>
                <div className="p-1 cursor-pointer" onClick={() => setSelectedSite(site)}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-neutralDark text-sm">{site.name}</span>
                  </div>
                  <Badge className={`text-[10px] px-2 py-0.5 ${STATUS_COLORS[site.status] || 'bg-gray-100'}`}>{site.status}</Badge>
                  <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <MapPin size={10} /> {site.address}
                  </div>
                  <Button size="sm" className="w-full mt-3 text-xs py-1.5 h-auto">Voir Détails</Button>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>

      {/* Legend / Overlay */}
      <div className="absolute top-6 right-6 bg-white p-4 rounded-lg shadow-lg max-w-xs z-[400] border border-gray-100 hidden sm:block">
        <h3 className="font-bold mb-2 text-sm flex items-center gap-2">
           <Navigation size={14} className="text-primary"/> 
           Carte des Chantiers
        </h3>
        <p className="text-xs text-gray-500 mb-3">Cliquez sur un marqueur pour voir les détails.</p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
           <span className="w-2 h-2 rounded-full bg-blue-500"></span> 
           <span>{sites.length} chantiers affichés</span>
        </div>
      </div>

      {/* Reusing the Detail SidePanel */}
      <SidePanel 
        isOpen={!!selectedSite} 
        onClose={() => setSelectedSite(null)} 
        title={selectedSite?.name || 'Détails du chantier'}
        footer={
           <>
              <Button variant="danger" size="sm">Supprimer</Button>
              <Button size="sm">Modifier</Button>
           </>
        }
      >
        {selectedSite && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-start justify-between">
              <div>
                 <Badge className={`${STATUS_COLORS[selectedSite.status] || 'bg-gray-100'} mb-2`}>{selectedSite.status}</Badge>
                 <h2 className="text-2xl font-bold text-neutralDark">{selectedSite.name}</h2>
                 <p className="text-gray-500 text-sm flex items-center gap-1 mt-1"><MapPin size={14}/> {selectedSite.address}</p>
              </div>
              <div className="text-right">
                 <div className="text-sm text-gray-500">Budget</div>
                 <div className="text-xl font-bold text-primary">{selectedSite.budget?.toLocaleString()} €</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">Progression</span>
                  <span className="text-sm font-bold text-primary">{selectedSite.progress || 0}%</span>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${selectedSite.progress || 0}%` }}></div>
               </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button 
                onClick={() => setActiveTab('infos')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'infos' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Informations
              </button>
              <button 
                onClick={() => setActiveTab('checklist')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'checklist' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Checklist
              </button>
              <button 
                onClick={() => setActiveTab('photos')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'photos' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Photos
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {activeTab === 'infos' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 bg-white rounded-lg border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar size={12}/> Début</div>
                        <div className="font-semibold">{selectedSite.startDate ? new Date(selectedSite.startDate).toLocaleDateString() : '-'}</div>
                     </div>
                     <div className="p-3 bg-white rounded-lg border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar size={12}/> Fin prévisionnelle</div>
                        <div className="font-semibold">{selectedSite.endDate ? new Date(selectedSite.endDate).toLocaleDateString() : '-'}</div>
                     </div>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border border-gray-100">
                     <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><Users size={16}/> Client</h4>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">
                           {selectedSite.client.charAt(0)}
                        </div>
                        <div>
                           <div className="font-medium">{selectedSite.client}</div>
                           <div className="text-xs text-gray-500">Voir la fiche client</div>
                        </div>
                     </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-gray-100">
                     <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><FileText size={16}/> Description</h4>
                     <p className="text-sm text-gray-600 leading-relaxed">
                        {selectedSite.description || "Aucune description fournie pour ce chantier."}
                     </p>
                  </div>
                </div>
              )}

              {activeTab === 'checklist' && (
                <div className="space-y-3 animate-in fade-in">
                  <p className="text-sm text-gray-500 italic">Fonctionnalité checklist connectée bientôt disponible.</p>
                  <Button variant="ghost" size="sm" className="w-full text-primary border-dashed border border-primary/20 bg-primary/5 mt-2">
                     <Plus size={14} className="mr-1"/> Ajouter une tâche
                  </Button>
                </div>
              )}

              {activeTab === 'photos' && (
                 <div className="grid grid-cols-3 gap-2 animate-in fade-in">
                    <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer">
                       <Plus size={24} />
                    </div>
                 </div>
              )}
            </div>
          </div>
        )}
      </SidePanel>
    </div>
  );
};
