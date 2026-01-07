
import React, { useState } from 'react';
import { Card, Badge, Button, Input } from '../components/ui/Common';
import { STATUS_COLORS } from '../constants';
import { ArrowUpRight, Calendar, CheckSquare, Clock, MapPin, TrendingUp, Plus, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { Site } from '../types';
import { useFirestore } from '../hooks/useFirestore';
import { useNavigate } from 'react-router-dom';
import { useLimitCheck } from '../hooks/useLimitCheck';

export const Dashboard = () => {
  const { data: sites, loading } = useFirestore<Site>('sites');
  const { isAtLimit } = useLimitCheck(sites);
  const navigate = useNavigate();

  // Interactive Tasks State
  const [tasks, setTasks] = useState([
    { id: 1, txt: 'Appeler Jean Dupont', done: false },
    { id: 2, txt: 'Commander matériel élec', done: true },
    { id: 3, txt: 'Valider devis Martin', done: false },
    { id: 4, txt: 'Réunion équipe 14h', done: false },
  ]);
  const [newTask, setNewTask] = useState('');

  const activeSites = sites.filter(s => s.status === 'En cours').length;
  const newSites = sites.filter(s => s.status === 'Nouveau').length;
  const activeBudget = sites
    .filter(s => s.status === 'En cours' || s.status === 'Nouveau')
    .reduce((sum, s) => sum + (Number(s.budget) || 0), 0);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), txt: newTask, done: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  if (loading) {
     return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col justify-between h-40 relative overflow-hidden group border-l-4 border-l-primary">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock size={80} className="text-primary" />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm">Chantiers en cours</p>
            <h3 className="text-4xl font-heading font-bold text-neutralDark mt-2">{activeSites}</h3>
          </div>
          <div className="flex items-center text-success text-sm font-medium">
            <TrendingUp size={16} className="mr-1" /> Données temps réel
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-40 border-l-4 border-l-accent">
           <div>
            <p className="text-gray-500 font-medium text-sm">Nouveaux Projets</p>
            <h3 className="text-4xl font-heading font-bold text-neutralDark mt-2">{newSites}</h3>
          </div>
          <div className="flex items-center text-primary text-sm font-medium cursor-pointer hover:underline" onClick={() => navigate('/sites')}>
            Voir les demandes <ArrowUpRight size={16} className="ml-1" />
          </div>
        </Card>

         <Card className="flex flex-col justify-between h-40 border-l-4 border-l-blue-400">
           <div>
            <p className="text-gray-500 font-medium text-sm">Budget Actif Total</p>
            <h3 className="text-3xl font-heading font-bold text-neutralDark mt-2">{(activeBudget / 1000).toFixed(1)}k €</h3>
          </div>
           <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
              <div className="bg-blue-400 h-2 rounded-full" style={{ width: '70%' }}></div>
           </div>
        </Card>

        <Card className="flex flex-col justify-between h-40 bg-gradient-to-br from-primary to-[#1f4a3a] text-white border-none shadow-lg">
           <div>
            <p className="text-white/80 font-medium text-sm">Actions Rapides</p>
            <div className="flex flex-col gap-2 mt-4">
               <button onClick={() => navigate('/sites')} className="bg-white/10 hover:bg-white/20 text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2">
                  <Plus size={14} /> Nouveau Chantier
               </button>
               <button onClick={() => navigate('/clients')} className="bg-white/10 hover:bg-white/20 text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2">
                  <Plus size={14} /> Nouveau Client
               </button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Schedule Widget */}
        <div className="lg:col-span-2">
           <Card className="h-full min-h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="text-primary" size={20} />
                  <h3 className="text-lg font-bold font-heading">Planning Hebdomadaire</h3>
                </div>
                <div className="text-sm text-gray-500">Semaine en cours</div>
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="grid grid-cols-5 gap-2 mb-2 text-center text-sm font-medium text-gray-500">
                  <div>Lun</div><div>Mar</div><div>Mer</div><div>Jeu</div><div>Ven</div>
                </div>
                
                <div className="flex-1 grid grid-cols-5 gap-2 relative bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <div className="absolute inset-0 grid grid-rows-4 pointer-events-none">
                     <div className="border-b border-gray-200 border-dashed"></div>
                     <div className="border-b border-gray-200 border-dashed"></div>
                     <div className="border-b border-gray-200 border-dashed"></div>
                     <div className="border-b border-gray-200 border-dashed"></div>
                  </div>

                  {sites.slice(0, 4).map((site, i) => {
                     const cols = ['col-start-1', 'col-start-2', 'col-start-3', 'col-start-4', 'col-start-5'];
                     const colors = [
                        'bg-blue-100 border-blue-500 text-blue-800',
                        'bg-orange-100 border-orange-500 text-orange-800',
                        'bg-purple-100 border-purple-500 text-purple-800',
                        'bg-green-100 border-green-500 text-green-800'
                     ];
                     const hasLimitConflict = isAtLimit(site);
                     
                     return (
                        <div key={site.id} className={`${cols[i % 5]} row-start-${(i % 3) + 1} row-span-2 ${colors[i % 4]} border-l-4 p-2 rounded text-xs z-10 m-1 shadow-sm overflow-hidden ${hasLimitConflict ? 'limit-halo' : ''}`}>
                           <strong>{site.name}</strong><br/>
                           {site.address.split(',')[0]}
                        </div>
                     )
                  })}
                </div>
              </div>
           </Card>
        </div>

        {/* Tasks Widget */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <h3 className="text-lg font-bold font-heading mb-4 flex items-center justify-between">
              <span>À faire</span>
              <span className="text-xs font-normal bg-secondary text-primary px-2 py-1 rounded-full">{tasks.filter(t => !t.done).length} restants</span>
            </h3>
            
            <div className="flex gap-2 mb-4">
              <Input placeholder="Nouvelle tâche..." value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask()} className="text-sm" />
              <Button size="sm" onClick={addTask} disabled={!newTask.trim()}><Plus size={16} /></Button>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar max-h-[300px]">
              {tasks.map((task) => (
                <div key={task.id} className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex items-start gap-3 cursor-pointer" onClick={() => toggleTask(task.id)}>
                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.done ? 'bg-success border-success text-white' : 'border-gray-300 hover:border-primary'}`}>
                      {task.done && <CheckSquare size={14} />}
                    </div>
                    <span className={`text-sm select-none ${task.done ? 'line-through text-gray-400' : 'text-neutralDark'}`}>{task.txt}</span>
                  </div>
                  <button onClick={() => removeTask(task.id)} className="text-gray-300 hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <h3 className="text-xl font-bold font-heading pt-4">Chantiers Récents</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.slice(0, 3).map(site => {
          const hasLimitConflict = isAtLimit(site);
          return (
            <Card key={site.id} className={`group cursor-pointer border hover:border-primary/30 transition-all ${hasLimitConflict ? 'limit-halo' : ''}`} onClick={() => navigate('/sites')}>
              <div className="flex justify-between items-start mb-4">
                <Badge className={STATUS_COLORS[site.status] || 'bg-gray-100'}>{site.status}</Badge>
                {hasLimitConflict && <AlertTriangle size={16} className="text-danger animate-pulse" title="Limite de capacité atteinte" />}
              </div>
              <h4 className="font-bold text-lg text-neutralDark mb-1 group-hover:text-primary transition-colors truncate">{site.name}</h4>
              <div className="flex items-center text-gray-500 text-sm mb-4 truncate">
                <MapPin size={14} className="mr-1 shrink-0" /> {site.address}
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                <div className={`h-1.5 rounded-full ${site.status === 'En cours' ? 'bg-primary' : 'bg-gray-400'}`} style={{ width: `${site.progress || 0}%` }}></div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={14} className="mr-2" />
                  {new Date(site.startDate).toLocaleDateString()}
                </div>
                <div className="flex -space-x-2">
                  {[1,2].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                      <img src={`https://i.pravatar.cc/50?u=${site.id}${i}`} className="w-full h-full object-cover" alt="User" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
