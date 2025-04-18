import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Event } from '../models/event.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MockEventService {
  private events: Event[] = [
    {
      id: '1',
      title: 'Concert Jazz',
      description: 'Un concert de jazz exceptionnel avec des artistes renommés.',
      date: '2024-04-15',
      location: 'Salle de concert principale',
      price: 25,
      imageUrl: '/assets/images/concert-jazz.jpg',
      published: true
    },
    {
      id: '2',
      title: 'Théâtre Classique',
      description: 'Une pièce de théâtre classique interprétée par une troupe talentueuse.',
      date: '2024-04-20',
      location: 'Grand Théâtre',
      price: 30,
      imageUrl: '/assets/images/theatre-classique.jpg',
      published: true
    },
    {
      id: '3',
      title: 'Spectacle de Danse',
      description: 'Un spectacle de danse contemporaine captivant.',
      date: '2024-04-25',
      location: 'Studio de danse',
      price: 20,
      imageUrl: '/assets/images/danse-contemporaine.jpg',
      published: false
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

  addEvent(event: Omit<Event, 'id'>): Promise<Event> {
    const newEvent: Event = {
      ...event,
      id: (this.events.length + 1).toString()
    };
    this.events.push(newEvent);
    return Promise.resolve(newEvent);
  }

  deleteEvent(id: string): Promise<void> {
    this.events = this.events.filter(event => event.id !== id);
    return Promise.resolve();
  }

  updateEvent(id: string, data: Partial<Event>): Promise<void> {
    const index = this.events.findIndex(event => event.id === id);
    if (index !== -1) {
      this.events[index] = { ...this.events[index], ...data };
    }
    return Promise.resolve();
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