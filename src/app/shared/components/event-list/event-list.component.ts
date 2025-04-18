import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventCardComponent } from '../event-card/event-card.component';
import { MockEventService } from '../../../services/mock-event.service';
import { Event, EventStatus } from '../../../models/event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule, EventCardComponent],
  template: `
    <section class="event-list">
      <div class="container">
        <div class="filters">
          <div class="filter-group">
            <label for="search">Rechercher</label>
            <input
              type="text"
              id="search"
              [(ngModel)]="searchTerm"
              (ngModelChange)="applyFilters()"
              placeholder="Rechercher un événement...">
          </div>
          
          <div class="filter-group">
            <label for="lieu">Lieu</label>
            <select id="lieu" [(ngModel)]="selectedLieu" (ngModelChange)="applyFilters()">
              <option value="">Tous les lieux</option>
              <option *ngFor="let lieu of uniqueLieux" [value]="lieu">{{ lieu }}</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="prix">Prix maximum</label>
            <input
              type="number"
              id="prix"
              [(ngModel)]="maxPrix"
              (ngModelChange)="applyFilters()"
              min="0"
              step="1">
          </div>
        </div>

        <div class="grid">
          <app-event-card
            *ngFor="let event of filteredEvents"
            [event]="event">
          </app-event-card>
        </div>

        <p *ngIf="filteredEvents.length === 0" class="no-results">
          Aucun événement ne correspond à vos critères.
        </p>
      </div>
    </section>
  `,
  styles: [`
    .event-list {
      padding: var(--spacing-xl) 0;
    }

    .filters {
      display: flex;
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-xl);
      flex-wrap: wrap;
    }

    .filter-group {
      flex: 1;
      min-width: 200px;

      label {
        display: block;
        margin-bottom: var(--spacing-xs);
        color: var(--text-secondary);
      }

      input, select {
        width: 100%;
        padding: var(--spacing-sm);
        border: 1px solid var(--text-secondary);
        border-radius: var(--border-radius-sm);
        background-color: var(--background-card);
        color: var(--text-primary);
        transition: var(--transition-base);

        &:focus {
          outline: none;
          border-color: var(--primary);
        }
      }
    }

    .no-results {
      text-align: center;
      color: var(--text-secondary);
      padding: var(--spacing-xl);
    }
  `]
})
export class EventListComponent {
  @Input() events: Event[] = [];
  @Output() eventSelected = new EventEmitter<Event>();

  searchTerm = '';
  selectedLieu = '';
  maxPrix: number | null = null;
  filteredEvents: Event[] = [];

  constructor(private eventService: MockEventService) {}

  ngOnInit() {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
      this.filteredEvents = events;
    });
  }

  get uniqueLieux(): string[] {
    return [...new Set(this.events.map(event => event.location))];
  }

  applyFilters() {
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = !this.searchTerm || 
        event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesLieu = !this.selectedLieu || event.location === this.selectedLieu;
      
      const matchesPrix = !this.maxPrix || event.price <= this.maxPrix;

      return matchesSearch && matchesLieu && matchesPrix;
    });
  }

  getStatusClass(event: Event): string {
    if (!event.published) {
      return 'status-draft';
    }

    switch (event.status) {
      case EventStatus.PUBLISHED:
        return 'status-published';
      case EventStatus.CANCELLED:
        return 'status-cancelled';
      case EventStatus.SOLD_OUT:
        return 'status-sold-out';
      case EventStatus.POSTPONED:
        return 'status-postponed';
      default:
        return 'status-draft';
    }
  }

  getStatusText(event: Event): string {
    if (!event.published) {
      return 'Brouillon';
    }

    switch (event.status) {
      case EventStatus.PUBLISHED:
        return 'Publié';
      case EventStatus.CANCELLED:
        return 'Annulé';
      case EventStatus.SOLD_OUT:
        return 'Complet';
      case EventStatus.POSTPONED:
        return 'Reporté';
      default:
        return 'Brouillon';
    }
  }
} 