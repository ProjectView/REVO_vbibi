import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '../components/ui/Common';
import { User, Mail, Lock, Camera, Save } from 'lucide-react';

export const ProfilePage = () => {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold font-heading text-neutralDark mb-6">Mon Profil</h2>

      <div className="grid gap-6">
        {/* Header Card */}
        <Card className="flex flex-col sm:flex-row items-center gap-6 p-8 bg-gradient-to-r from-primary/5 to-transparent border-primary/10">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md overflow-hidden">
               <img src="https://i.pravatar.cc/150?u=admin" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition-transform hover:scale-110">
               <Camera size={16} />
            </button>
          </div>
          <div className="text-center sm:text-left">
             <h3 className="text-2xl font-bold text-neutralDark">Thomas Morel</h3>
             <p className="text-gray-500 mb-2">Administrateur</p>
             <Badge className="bg-primary/10 text-primary">BTP Pro Construction</Badge>
          </div>
        </Card>

        {/* Personal Info */}
        <Card className="space-y-6">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-4">
             <User className="text-primary" size={20} />
             <h3 className="font-bold text-lg">Informations Personnelles</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Input label="Prénom" defaultValue="Thomas" />
             <Input label="Nom" defaultValue="Morel" />
          </div>
          
          <Input 
             label="Email" 
             type="email" 
             defaultValue="thomas.morel@btp-pro.fr" 
             icon={<Mail size={16} />} 
          />
        </Card>

        {/* Security */}
        <Card className="space-y-6">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-4">
             <Lock className="text-primary" size={20} />
             <h3 className="font-bold text-lg">Sécurité</h3>
          </div>
          
          <div className="space-y-4">
             <Input label="Mot de passe actuel" type="password" placeholder="••••••••" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nouveau mot de passe" type="password" placeholder="••••••••" />
                <Input label="Confirmer le mot de passe" type="password" placeholder="••••••••" />
             </div>
          </div>
        </Card>

        {/* Footer Actions */}
        <div className="flex justify-end pt-4">
           <Button onClick={handleSave} isLoading={loading} className="w-full sm:w-auto flex items-center gap-2">
              <Save size={18} /> Enregistrer les modifications
           </Button>
        </div>
      </div>
    </div>
  );
};