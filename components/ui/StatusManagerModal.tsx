import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button, Input } from './Common';
import { Trash2, Plus, GripVertical } from 'lucide-react';

export interface ColumnConfig {
  id: string;
  title: string;
  colorTheme: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'gray';
}

interface StatusManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialColumns: ColumnConfig[];
  onSave: (newColumns: ColumnConfig[]) => void;
}

const COLOR_THEMES = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
  red: 'bg-red-500',
  gray: 'bg-gray-500',
};

export const StatusManagerModal: React.FC<StatusManagerModalProps> = ({ isOpen, onClose, initialColumns, onSave }) => {
  const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns);

  useEffect(() => {
    if (isOpen) {
      setColumns(initialColumns);
    }
  }, [isOpen, initialColumns]);

  const handleChange = (id: string, field: keyof ColumnConfig, value: string) => {
    setColumns(prev => prev.map(col => col.id === id ? { ...col, [field]: value } : col));
  };

  const handleDelete = (id: string) => {
    setColumns(prev => prev.filter(col => col.id !== id));
  };

  const handleAdd = () => {
    const newId = `col-${Date.now()}`;
    setColumns(prev => [...prev, { id: newId, title: 'Nouveau Statut', colorTheme: 'gray' }]);
  };

  const handleSave = () => {
    onSave(columns);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gérer les statuts du tableau" size="lg">
      <div className="space-y-4">
        <p className="text-sm text-gray-500 mb-4">
          Personnalisez les colonnes de votre Kanban. Vous pouvez renommer les statuts, changer leurs couleurs ou en ajouter de nouveaux.
        </p>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {columns.map((col, index) => (
            <div key={col.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg group">
              <div className="text-gray-400 cursor-move">
                <GripVertical size={20} />
              </div>
              
              <div className="flex-1">
                <label className="text-xs text-gray-400 font-medium ml-1">Nom de la colonne</label>
                <Input 
                  value={col.title} 
                  onChange={(e) => handleChange(col.id, 'title', e.target.value)}
                  className="bg-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-medium ml-1">Couleur</label>
                <select 
                  className="w-full h-[42px] px-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                  value={col.colorTheme}
                  onChange={(e) => handleChange(col.id, 'colorTheme', e.target.value as any)}
                >
                  <option value="blue">Bleu</option>
                  <option value="green">Vert</option>
                  <option value="orange">Orange</option>
                  <option value="purple">Violet</option>
                  <option value="red">Rouge</option>
                  <option value="gray">Gris</option>
                </select>
              </div>

              <div className="flex items-end h-[42px]">
                 <button 
                  onClick={() => handleDelete(col.id)}
                  className="p-2 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <Button variant="secondary" onClick={handleAdd} className="w-full border-dashed border-2 flex items-center gap-2 justify-center py-3">
          <Plus size={18} /> Ajouter une colonne
        </Button>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSave}>Enregistrer les modifications</Button>
        </div>
      </div>
    </Modal>
  );
};