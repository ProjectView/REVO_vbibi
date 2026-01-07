export type Status = 'Nouveau' | 'En cours' | 'En révision' | 'Terminé' | 'Archivé';

export type LeadStatus = 'Nouveau' | 'Qualifié' | 'Devis envoyé' | 'Négociation' | 'Gagné' | 'Perdu';

export interface Team {
  id: string;
  name: string;
  members: string[]; // URLs or Initials
  color: string;
}

export interface Site {
  id: string;
  name: string;
  client: string;
  clientId?: string;
  address: string;
  lat?: number; // Added for Leaflet
  lng?: number; // Added for Leaflet
  status: Status;
  budget: number;
  startDate: string; // ISO Date
  endDate: string; // ISO Date
  description?: string;
  teamId?: string;
  progress?: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  siteId?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  tasks: string[];
}

export interface Lead {
  id: string;
  contactName: string;
  companyName?: string;
  projectType: string; // ex: Rénovation totale
  email: string;
  phone: string;
  status: LeadStatus;
  estimatedBudget: number;
  source: string; // ex: Site Web, Bouche à oreille
  createdAt: string;
  notes?: string;
}