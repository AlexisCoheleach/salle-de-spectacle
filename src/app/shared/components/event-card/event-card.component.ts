import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Event, EventStatus } from '../../../models/event.model';
import { ImageComponent } from '../image/image.component';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageComponent],
  template: `
    <div class="event-card">
      <div class="event-status" [ngClass]="getStatusClass()">
        {{ getStatusText() }}
      </div>
      <app-image
        [src]="getImageUrl(event.imageUrl)"
        [alt]="event.title"
        className="event-image"
      ></app-image>
      <div class="event-content">
        <h3>{{ event.title }}</h3>
        <div class="event-details">
          <p class="event-date">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {{ event.date }}
          </p>
          <p class="event-location">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {{ event.location }}
          </p>
          <p class="event-price">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            {{ event.price }} €
          </p>
        </div>
        <p class="event-description">{{ event.description | slice:0:150 }}...</p>
        <a [routerLink]="['/evenements', event.id]" class="btn btn-primary">Voir plus</a>
      </div>
    </div>
  `,
  styles: [`
    .event-card {
      background-color: var(--background-card);
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      transition: var(--transition-base);
      position: relative;

      &:hover {
        transform: translateY(-4px);
      }

      .event-status {
        position: absolute;
        top: var(--spacing-sm);
        right: var(--spacing-sm);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--border-radius-sm);
        font-size: 0.75rem;
        font-weight: 500;
        z-index: 1;
        color: white;

        &.status-draft {
          background-color: #ffc107;
        }

        &.status-published {
          background-color: #28a745;
        }

        &.status-cancelled {
          background-color: #dc3545;
        }

        &.status-sold-out {
          background-color: #dc3545;
        }

        &.status-postponed {
          background-color: #ffc107;
        }
      }
    }

    .event-image {
      height: 200px;
      width: 100%;
    }

    .event-content {
      padding: var(--spacing-lg);

      h3 {
        margin: 0 0 var(--spacing-sm);
        color: var(--text-primary);
      }

      .event-details {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-md);

        p {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--text-secondary);
          font-size: 0.9rem;

          svg {
            color: var(--primary);
          }
        }
      }
    }

    .event-description {
      color: var(--text-secondary);
      margin-bottom: var(--spacing-lg);
      flex-grow: 1;
    }

    .btn {
      align-self: flex-start;
    }
  `]
})
export class EventCardComponent {
  @Input() event!: Event;

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) {
      return '/assets/images/placeholder.png';
    }
    
    if (imageUrl.startsWith('/assets')) {
      return imageUrl;
    }
    
    return `/assets/images/events/${imageUrl}`;
  }

  getStatusClass(): string {
    if (!this.event.published) {
      return 'status-draft';
    }

    switch (this.event.status) {
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

  getStatusText(): string {
    if (!this.event.published) {
      return 'Brouillon';
    }

    switch (this.event.status) {
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