import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MockEventService } from '../../services/mock-event.service';
import { Event, EventStatus } from '../../models/event.model';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="event-details">
      <div class="container">
        <button class="btn btn-secondary" routerLink="/evenements">Retour aux événements</button>
        
        <div class="event-content" *ngIf="event">
          <div class="event-header">
            <img [src]="event.imageUrl || 'assets/images/placeholder.jpg'" [alt]="event.title">
            <div class="event-info">
              <h1>{{ event.title }}</h1>
              <div class="event-status" [ngClass]="getStatusClass()">
                {{ getStatusText() }}
              </div>
              <p class="event-date">{{ event.date }} à {{ event.time }}</p>
              <p class="event-location">{{ event.location }}</p>
              <p class="event-address">{{ event.address }}, {{ event.postalCode }} {{ event.city }}</p>
              <p class="event-price">Prix normal : {{ event.price }}€</p>
              <p class="event-reduced-price" *ngIf="event.reducedPrice">Prix réduit : {{ event.reducedPrice }}€</p>
              <p class="event-capacity">Places disponibles : {{ event.availableSeats }}/{{ event.maxCapacity }}</p>
              <p class="event-duration">Durée : {{ event.duration }} minutes</p>
              <p class="event-category">Catégorie : {{ event.category }}</p>
            </div>
          </div>
          
          <div class="event-description">
            <h2>Description</h2>
            <p>{{ event.description }}</p>
          </div>

          <div class="event-artists" *ngIf="event.artists && event.artists.length > 0">
            <h2>Artistes</h2>
            <div class="artists-list">
              <div class="artist" *ngFor="let artist of event.artists">
                <h3>{{ artist.name }}</h3>
                <p class="artist-role">{{ artist.role }}</p>
                <p class="artist-bio">{{ artist.bio }}</p>
              </div>
            </div>
          </div>

          <div class="event-tags" *ngIf="event.tags && event.tags.length > 0">
            <h2>Tags</h2>
            <div class="tags-list">
              <span class="tag" *ngFor="let tag of event.tags">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .event-details {
      padding: var(--spacing-xl) 0;
      min-height: 100vh;
      background-color: var(--background);
    }

    .event-content {
      margin-top: var(--spacing-xl);
      background-color: var(--background-card);
      border-radius: var(--border-radius-lg);
      overflow: hidden;
    }

    .event-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-xl);

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .event-info {
      padding: var(--spacing-xl);
      position: relative;

      h1 {
        color: var(--text-primary);
        margin-bottom: var(--spacing-md);
      }

      .event-status {
        position: absolute;
        top: var(--spacing-xl);
        right: var(--spacing-xl);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--border-radius-sm);
        font-size: 0.875rem;
        font-weight: 500;
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

      .event-date,
      .event-location,
      .event-address,
      .event-price,
      .event-reduced-price,
      .event-capacity,
      .event-duration,
      .event-category {
        color: var(--text-secondary);
        margin-bottom: var(--spacing-sm);
      }
    }

    .event-artists {
      padding: var(--spacing-xl);
      border-top: 1px solid var(--border-color);

      h2 {
        color: var(--text-primary);
        margin-bottom: var(--spacing-md);
      }

      .artists-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-lg);
      }

      .artist {
        background-color: var(--background);
        padding: var(--spacing-lg);
        border-radius: var(--border-radius-md);

        h3 {
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
        }

        .artist-role {
          color: var(--primary);
          margin-bottom: var(--spacing-sm);
        }

        .artist-bio {
          color: var(--text-secondary);
          line-height: 1.6;
        }
      }
    }

    .event-tags {
      padding: var(--spacing-xl);
      border-top: 1px solid var(--border-color);

      h2 {
        color: var(--text-primary);
        margin-bottom: var(--spacing-md);
      }

      .tags-list {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
      }

      .tag {
        background-color: var(--primary);
        color: white;
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--border-radius-sm);
        font-size: 0.875rem;
      }
    }

    .event-description {
      padding: var(--spacing-xl);
      border-top: 1px solid var(--border-color);

      h2 {
        color: var(--text-primary);
        margin-bottom: var(--spacing-md);
      }

      p {
        color: var(--text-secondary);
        line-height: 1.6;
      }
    }
  `]
})
export class EventDetailsComponent implements OnInit {
  event: Event | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventService: MockEventService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventService.getEvent(id).subscribe(event => {
        this.event = event;
      });
    }
  }

  getStatusClass(): string {
    if (!this.event) return 'status-draft';
    if (!this.event.published) return 'status-draft';

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
    if (!this.event) return 'Brouillon';
    if (!this.event.published) return 'Brouillon';

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