import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Event, EventCategory, EventStatus } from '../models/event.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MockEventService {
  private events: Event[] = [
    {
      id: '1',
      title: 'Concert de Jazz',
      description: 'Un concert exceptionnel avec les meilleurs musiciens de jazz de la région.',
      date: '2024-04-15',
      time: '20:00',
      duration: 120,
      location: 'Salle des Fêtes',
      address: '123 Rue de la Musique',
      city: 'Paris',
      postalCode: '75001',
      price: 25,
      reducedPrice: 15,
      maxCapacity: 200,
      availableSeats: 150,
      imageUrl: 'assets/images/events/jazz-concert.jpg',
      category: EventCategory.CONCERT,
      artists: [
        {
          id: '1',
          name: 'John Smith',
          role: 'Pianiste',
          bio: 'Pianiste de jazz renommé avec plus de 20 ans d\'expérience.',
          imageUrl: 'assets/images/artists/john-smith.jpg'
        }
      ],
      published: true,
      createdAt: '2024-03-01T10:00:00Z',
      updatedAt: '2024-03-01T10:00:00Z',
      createdBy: 'admin1',
      tags: ['jazz', 'concert', 'musique'],
      status: EventStatus.PUBLISHED
    },
    {
      id: '2',
      title: 'Pièce de Théâtre',
      description: 'Une adaptation moderne d\'une pièce classique.',
      date: '2024-04-20',
      time: '19:30',
      duration: 90,
      location: 'Théâtre Municipal',
      address: '456 Avenue des Arts',
      city: 'Lyon',
      postalCode: '69001',
      price: 30,
      reducedPrice: 20,
      maxCapacity: 150,
      availableSeats: 100,
      imageUrl: 'assets/images/events/theatre-play.jpg',
      category: EventCategory.THEATRE,
      artists: [
        {
          id: '2',
          name: 'Marie Dupont',
          role: 'Actrice principale',
          bio: 'Actrice primée avec une longue carrière au théâtre.',
          imageUrl: 'assets/images/artists/marie-dupont.jpg'
        }
      ],
      published: true,
      createdAt: '2024-03-02T11:00:00Z',
      updatedAt: '2024-03-02T11:00:00Z',
      createdBy: 'admin2',
      tags: ['théâtre', 'drame', 'classique'],
      status: EventStatus.PUBLISHED
    },
    {
      id: '3',
      title: 'Spectacle de Danse',
      description: 'Un spectacle de danse contemporaine captivant.',
      date: '2024-04-25',
      time: '20:00',
      duration: 90,
      location: 'Studio de danse',
      address: '789 Rue de la Danse',
      city: 'Marseille',
      postalCode: '13001',
      price: 20,
      reducedPrice: 15,
      maxCapacity: 100,
      availableSeats: 100,
      imageUrl: '/assets/images/danse-contemporaine.jpg',
      category: EventCategory.DANSE,
      artists: [],
      tags: ['danse', 'contemporain'],
      published: false,
      createdAt: '2024-03-03T12:00:00Z',
      updatedAt: '2024-03-03T12:00:00Z',
      createdBy: 'admin3',
      status: EventStatus.DRAFT
    }
  ];

  constructor(private authService: AuthService) {}

  getEvents(): Observable<Event[]> {
    return of(this.events).pipe(
      map(events => {
        // Si l'utilisateur n'est pas connecté, ne montrer que les événements publiés
        if (!this.authService.isAuthenticated()) {
          return events.filter(event => event.published);
        }
        return events;
      })
    );
  }

  getEvent(id: string): Observable<Event> {
    const event = this.events.find(event => event.id === id);
    if (!event) {
      throw new Error('Event not found');
    }
    // Si l'utilisateur n'est pas connecté et que l'événement n'est pas publié, ne pas le montrer
    if (!this.authService.isAuthenticated() && !event.published) {
      throw new Error('Event not found');
    }
    return of(event).pipe(delay(300));
  }

  addEvent(event: Event): Observable<Event> {
    const newEvent: Event = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      time: event.time || '20:00',
      duration: event.duration || 120,
      address: event.address || '',
      city: event.city || '',
      postalCode: event.postalCode || '',
      reducedPrice: event.reducedPrice || 0,
      maxCapacity: event.maxCapacity || 100,
      availableSeats: event.availableSeats || event.maxCapacity || 100,
      category: event.category || EventCategory.CONCERT,
      artists: event.artists || [],
      tags: event.tags || [],
      createdBy: event.createdBy || 'admin',
      status: event.status || EventStatus.DRAFT,
      published: event.published || false
    };

    this.events.push(newEvent);
    return of(newEvent);
  }

  deleteEvent(id: string): Observable<void> {
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error(`Event with id ${id} not found`);
    }
    this.events.splice(index, 1);
    return of(undefined);
  }

  updateEvent(event: Event): Observable<Event> {
    const index = this.events.findIndex(e => e.id === event.id);
    if (index === -1) {
      return throwError(() => new Error('Event not found'));
    }

    const updatedEvent: Event = {
      ...event,
      updatedAt: new Date().toISOString(),
      time: event.time || '20:00',
      duration: event.duration || 120,
      address: event.address || '',
      city: event.city || '',
      postalCode: event.postalCode || '',
      reducedPrice: event.reducedPrice || 0,
      maxCapacity: event.maxCapacity || 100,
      availableSeats: event.availableSeats || event.maxCapacity || 100,
      category: event.category || EventCategory.CONCERT,
      artists: event.artists || [],
      tags: event.tags || [],
      createdBy: event.createdBy || 'admin',
      status: event.status || EventStatus.DRAFT,
      published: event.published || false
    };

    this.events[index] = updatedEvent;
    return of(updatedEvent);
  }

  createEvent(event: Omit<Event, 'id'>): Observable<Event> {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString()
    };
    this.events.push(newEvent);
    return of(newEvent).pipe(delay(300));
  }
} 