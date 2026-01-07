import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '../components/ui/Common';
import { generateChecklist } from '../services/geminiService';
import { Sparkles, CheckCircle, Plus, Copy, AlertCircle, Loader2, Save } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';
import { Template } from '../types';
import { useToast } from '../components/ui/Toast';

export const Templates = () => {
  const { data: templates, loading: templatesLoading, add } = useFirestore<Template>('templates');
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'library' | 'generator'>('library');
  const [siteType, setSiteType] = useState('');
  const [context, setContext] = useState('');
  const [generatedTasks, setGeneratedTasks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!siteType) return;
    setLoading(true);
    setError('');
    setGeneratedTasks([]);
    
    try {
      const tasks = await generateChecklist(siteType, context);
      setGeneratedTasks(tasks);
    } catch (e: any) {
      setError(e.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
     if (generatedTasks.length === 0 || !siteType) return;
     
     await add({
        name: siteType,
        description: context || `Généré par IA pour ${siteType}`,
        tasks: generatedTasks
     } as any);

     setActiveTab('library');
     setSiteType('');
     setContext('');
     setGeneratedTasks([]);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      
      {/* Header Tabs */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-xl inline-flex">
          <button 
            onClick={() => setActiveTab('library')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'library' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Bibliothèque
          </button>
          <button 
            onClick={() => setActiveTab('generator')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'generator' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Sparkles size={16} className={activeTab === 'generator' ? "text-accent" : ""} /> Générateur IA
          </button>
        </div>
      </div>

      {activeTab === 'library' ? (
        <>
        {templatesLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(template => (
            <Card key={template.id} className="relative group hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                 <div className="w-10 h-10 bg-[#E1F2EC] rounded-lg flex items-center justify-center text-primary">
                    <CheckCircle size={20} />
                 </div>
                 <Button variant="ghost" size="sm" onClick={() => {
                    navigator.clipboard.writeText(template.tasks.join('\n'));
                    addToast("Liste copiée dans le presse-papier", "success");
                 }}>
                    <Copy size={16}/>
                 </Button>
              </div>
              <h3 className="font-bold text-lg mb-2">{template.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{template.description}</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Aperçu des tâches</p>
                <ul className="space-y-2">
                  {template.tasks.slice(0, 3).map((task, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span> {task}
                    </li>
                  ))}
                  {template.tasks.length > 3 && <li className="text-xs text-gray-400 italic">+ {template.tasks.length - 3} autres...</li>}
                </ul>
              </div>
            </Card>
          ))}
          
          <button 
            onClick={() => setActiveTab('generator')}
            className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-8 hover:border-primary hover:bg-primary/5 transition-all group min-h-[300px]"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
              <Plus size={24} />
            </div>
            <span className="font-medium text-gray-600 group-hover:text-primary">Créer un nouveau modèle</span>
          </button>
        </div>
        )}
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Input Section */}
          <Card className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white">
                 <Sparkles size={20} />
               </div>
               <div>
                 <h2 className="font-bold text-xl">Assistant Gemini</h2>
                 <p className="text-sm text-gray-500">Décrivez votre chantier, l'IA s'occupe du reste.</p>
               </div>
            </div>
            
            <hr className="border-gray-100" />

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Type de chantier</label>
                <Input 
                  placeholder="Ex: Rénovation cuisine, Construction piscine..." 
                  value={siteType}
                  onChange={(e) => setSiteType(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5">Contexte spécifique (Optionnel)</label>
                <textarea 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors min-h-[100px]"
                  placeholder="Ex: Vieille maison en pierre, accès difficile, client exigeant sur les finitions..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                ></textarea>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 flex gap-3 text-sm text-yellow-800">
                <AlertCircle size={20} className="shrink-0" />
                <p>Nécessite une clé API Gemini configurée (process.env.API_KEY).</p>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 border-none" 
                size="lg"
                onClick={handleGenerate}
                isLoading={loading}
                disabled={!siteType}
              >
                {loading ? 'Génération en cours...' : 'Générer la Checklist'}
              </Button>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                   <AlertCircle size={16} /> {error}
                </div>
              )}
            </div>
          </Card>

          {/* Result Section */}
          <div className="space-y-4">
            {generatedTasks.length > 0 ? (
               <Card className="bg-[#F8F9FA] border-primary/20 animate-in slide-in-from-right-4">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-lg">Résultat ({generatedTasks.length} tâches)</h3>
                   <Badge className="bg-success/10 text-success">Généré par IA</Badge>
                 </div>
                 <ul className="space-y-3">
                   {generatedTasks.map((task, i) => (
                     <li key={i} className="flex items-start gap-3 bg-white p-3 rounded-md shadow-sm border border-gray-100 animate-in fade-in" style={{animationDelay: `${i * 50}ms`}}>
                       <div className="mt-1 w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                       <span className="text-gray-700">{task}</span>
                     </li>
                   ))}
                 </ul>
                 <div className="mt-6 flex gap-3">
                   <Button className="flex-1 flex items-center justify-center gap-2" onClick={handleSaveTemplate}>
                     <Save size={16} /> Sauvegarder comme modèle
                   </Button>
                   <Button variant="secondary" className="flex-1 flex items-center justify-center gap-2" onClick={() => {
                       navigator.clipboard.writeText(generatedTasks.join('\n'));
                       addToast("Copié !", "success");
                   }}>
                      <Copy size={16} /> Copier
                   </Button>
                 </div>
               </Card>
            ) : (
              <div className="h-full min-h-[400px] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 text-center p-8">
                {loading ? (
                   <div className="flex flex-col items-center animate-pulse">
                     <Loader2 size={48} className="animate-spin text-purple-500 mb-4" />
                     <p>Gemini réfléchit...</p>
                   </div>
                ) : (
                  <>
                    <Sparkles size={48} className="mb-4 text-gray-300" />
                    <p className="font-medium">Les résultats apparaîtront ici</p>
                    <p className="text-sm mt-2">Lancez une génération pour voir la magie opérer.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};