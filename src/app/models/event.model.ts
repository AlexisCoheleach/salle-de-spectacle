export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string; // Heure de début
  duration: number; // Durée en minutes
  location: string;
  address: string; // Adresse complète
  city: string;
  postalCode: string;
  price: number;
  reducedPrice?: number; // Prix réduit (étudiants, seniors, etc.)
  maxCapacity: number; // Capacité maximale
  availableSeats: number; // Places disponibles
  imageUrl: string;
  category: EventCategory; // Catégorie de l'événement
  artists: Artist[]; // Liste des artistes
  published: boolean;
  createdAt: string; // Date de création
  updatedAt: string; // Date de dernière modification
  createdBy: string; // ID de l'utilisateur qui a créé l'événement
  tags: string[]; // Tags pour faciliter la recherche
  status: EventStatus; // Statut de l'événement
  cancellationReason?: string; // Raison de l'annulation si applicable
}

export interface Artist {
  id: string;
  name: string;
  role: string; // Rôle dans l'événement (ex: "Chanteur", "Danseur", etc.)
  bio?: string;
  imageUrl?: string;
}

export enum EventCategory {
  CONCERT = 'CONCERT',
  THEATRE = 'THEATRE',
  DANSE = 'DANSE',
  HUMOUR = 'HUMOUR',
  CIRQUE = 'CIRQUE',
  OPERA = 'OPERA',
  CLASSIQUE = 'CLASSIQUE',
  EXPOSITION = 'EXPOSITION',
  CONFERENCE = 'CONFERENCE',
  AUTRE = 'AUTRE'
}

export enum EventStatus {
  DRAFT = 'DRAFT', // Brouillon
  PUBLISHED = 'PUBLISHED', // Publié
  CANCELLED = 'CANCELLED', // Annulé
  SOLD_OUT = 'SOLD_OUT', // Complet
  POSTPONED = 'POSTPONED' // Reporté
} 