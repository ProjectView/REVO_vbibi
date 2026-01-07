import { Site, Client, Template, Team, Lead } from './types';

export const STATUS_COLORS: Record<string, string> = {
  'Nouveau': 'bg-blue-100 text-blue-800 border-blue-200',
  'En cours': 'bg-accent/20 text-orange-800 border-accent/40',
  'En révision': 'bg-purple-100 text-purple-800 border-purple-200',
  'Terminé': 'bg-success/20 text-green-800 border-success/40',
  'Archivé': 'bg-gray-200 text-gray-600 border-gray-300',
};

export const MOCK_TEAMS: Team[] = [
  { id: 't1', name: 'Équipe Alpha', members: ['TM', 'JD', 'AL'], color: 'bg-blue-500' },
  { id: 't2', name: 'Équipe Bravo', members: ['SM', 'KP'], color: 'bg-purple-500' },
  { id: 't3', name: 'Sous-traitants', members: ['ST'], color: 'bg-orange-500' },
];

export const MOCK_SITES: Site[] = [
  {
    id: '1',
    name: 'Rénovation Haussmann',
    client: 'Jean Dupont',
    clientId: '1',
    address: '12 Rue de Rivoli, Paris',
    lat: 48.8556,
    lng: 2.3582,
    status: 'En cours',
    budget: 45000,
    startDate: '2023-10-15',
    endDate: '2023-12-20',
    description: 'Rénovation complète appartement 80m2.',
    teamId: 't1',
    progress: 65
  },
  {
    id: '2',
    name: 'Extension Villa Sud',
    client: 'Sophie Martin',
    clientId: '2',
    address: '45 Avenue du Soleil, Nice',
    lat: 43.7102,
    lng: 7.2620,
    status: 'Nouveau',
    budget: 120000,
    startDate: '2024-01-10',
    endDate: '2024-04-15',
    description: 'Création dépendance et piscine.',
    teamId: 't2',
    progress: 0
  },
  {
    id: '3',
    name: 'Bureaux TechFlow',
    client: 'TechFlow SAS',
    clientId: '3',
    address: '8 Boulevard Haussmann, Paris',
    lat: 48.8722,
    lng: 2.3323,
    status: 'En révision',
    budget: 85000,
    startDate: '2023-11-01',
    endDate: '2024-02-28',
    description: 'Aménagement open space 200m2.',
    teamId: 't1',
    progress: 30
  },
  {
    id: '4',
    name: 'Toiture Résidence Les Pins',
    client: 'Syndic Azur',
    clientId: '4',
    address: 'Allée des Pins, Cannes',
    lat: 43.5528,
    lng: 7.0174,
    status: 'Terminé',
    budget: 32000,
    startDate: '2023-09-01',
    endDate: '2023-09-30',
    teamId: 't3',
    progress: 100
  },
  {
    id: '5',
    name: 'Cuisine Restaurant Le Chef',
    client: 'Marc Veyrat (Fictif)',
    clientId: '5',
    address: 'Lyon Centre',
    lat: 45.7640,
    lng: 4.8357,
    status: 'En cours',
    budget: 55000,
    startDate: '2023-10-20',
    endDate: '2023-11-30',
    teamId: 't2',
    progress: 80
  },
  {
    id: '6',
    name: 'Loft Industriel',
    client: 'Alice Cooper',
    clientId: '6',
    address: 'Bordeaux',
    lat: 44.8378,
    lng: -0.5792,
    status: 'Nouveau',
    budget: 210000,
    startDate: '2024-02-01',
    endDate: '2024-08-30',
    teamId: 't1',
    progress: 0
  }
];

export const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Jean Dupont', email: 'jean.d@example.com', phone: '06 12 34 56 78', company: 'Particulier', address: '12 Rue de Rivoli, Paris', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Sophie Martin', email: 's.martin@example.com', phone: '06 98 76 54 32', company: 'Particulier', address: '45 Avenue du Soleil, Nice', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'TechFlow SAS', email: 'contact@techflow.io', phone: '01 44 55 66 77', company: 'TechFlow', address: 'La Défense, Paris', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Syndic Azur', email: 'contact@syndic-azur.fr', phone: '04 93 00 00 00', company: 'Syndic Azur', address: 'Cannes', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'Marc Veyrat (Fictif)', email: 'chef@restaurant.com', phone: '06 00 00 00 00', company: 'Le Chef', address: 'Lyon', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: '6', name: 'Alice Cooper', email: 'alice@rock.com', phone: '06 66 66 66 66', company: 'Particulier', address: 'Bordeaux', avatar: 'https://i.pravatar.cc/150?u=6' },
];

export const MOCK_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'Rénovation Salle de Bain',
    description: 'Checklist standard pour refonte complète SDB',
    tasks: ['Couper eau', 'Démolition carrelage', 'Plomberie', 'Électricité', 'Pose receveur', 'Carrelage', 'Joints', 'Peinture']
  },
  {
    id: '2',
    name: 'Visite Fin de Chantier',
    description: 'Points de contrôle avant livraison',
    tasks: ['Nettoyage fin de chantier', 'Test prises électriques', 'Test arrivées eau', 'Retouches peinture', 'Remise des clés']
  },
  {
    id: '3',
    name: 'Sécurité Chantier (Démarrage)',
    description: 'Vérifications obligatoires avant travaux',
    tasks: ['Balisage zone', 'Port des EPI', 'Coupure réseaux', 'Affichage permis', 'Extincteurs en place']
  }
];

export const MOCK_LEADS: Lead[] = [
  {
    id: 'l1',
    contactName: 'Pierre Durand',
    companyName: 'Boulangerie Durand',
    projectType: 'Devanture Magasin',
    email: 'pierre@durand.fr',
    phone: '06 11 22 33 44',
    status: 'Nouveau',
    estimatedBudget: 15000,
    source: 'Site Web',
    createdAt: '2023-10-18',
    notes: 'Besoin urgent, ouverture prévue mois prochain.'
  },
  {
    id: 'l2',
    contactName: 'Marie Curie',
    projectType: 'Isolation Combles',
    email: 'm.curie@email.com',
    phone: '06 99 88 77 66',
    status: 'Qualifié',
    estimatedBudget: 8000,
    source: 'Bouche à oreille',
    createdAt: '2023-10-15'
  },
  {
    id: 'l3',
    contactName: 'SARL ImmoPlus',
    companyName: 'Agence ImmoPlus',
    projectType: 'Rénovation 3 apparts',
    email: 'contact@immoplus.fr',
    phone: '04 00 00 00 00',
    status: 'Devis envoyé',
    estimatedBudget: 150000,
    source: 'Partenariat',
    createdAt: '2023-10-10'
  },
  {
    id: 'l4',
    contactName: 'Lucas Bernard',
    projectType: 'Construction Garage',
    email: 'lucas.b@email.com',
    phone: '06 55 44 33 22',
    status: 'Négociation',
    estimatedBudget: 25000,
    source: 'Réseaux Sociaux',
    createdAt: '2023-10-05'
  },
  {
    id: 'l5',
    contactName: 'Emma Stone',
    projectType: 'Piscine',
    email: 'emma@hollywood.com',
    phone: '06 00 00 00 00',
    status: 'Perdu',
    estimatedBudget: 45000,
    source: 'Site Web',
    createdAt: '2023-09-20',
    notes: 'Trop cher, parti chez concurrent.'
  }
];