import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { Event } from '../../../models/event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <article class="event-detail">
      <div class="container">
        <div class="event-header">
          <div class="event-image">
            <img [src]="event.imageUrl || 'assets/images/placeholder.jpg'" [alt]="event.title">
          </div>
          <div class="event-info">
            <h1>{{ event.title }}</h1>
            <div class="event-meta">
              <p class="event-date">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {{ event.date }}
              </p>
              <p class="event-location">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {{ event.location }}
              </p>
              <p class="event-price">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                {{ event.price }} €
              </p>
            </div>
          </div>
        </div>

        <div class="event-content">
          <div class="event-description">
            <h2>Description</h2>
            <p>{{ event.description }}</p>
          </div>

          <aside class="event-actions">
            <div class="card">
              <h3>Réserver votre place</h3>
              <p class="price">{{ event.price }} €</p>
              <app-button variant="primary">Réserver maintenant</app-button>
            </div>
          </aside>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .event-detail {
      padding: var(--spacing-xl) 0;
    }

    .event-header {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--spacing-xl);
      margin-bottom: var(--spacing-xl);

      @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
      }
    }

    .event-image {
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      aspect-ratio: 16/9;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .event-info {
      h1 {
        margin-bottom: var(--spacing-lg);
        font-size: 2.5rem;
        line-height: 1.2;
      }
    }

    .event-meta {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);

      p {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        color: var(--text-secondary);
        font-size: 1.1rem;

        svg {
          color: var(--primary);
        }
      }
    }

    .event-content {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--spacing-xl);

      @media (min-width: 768px) {
        grid-template-columns: 2fr 1fr;
      }
    }

    .event-description {
      h2 {
        margin-bottom: var(--spacing-lg);
        font-size: 1.5rem;
      }

      p {
        color: var(--text-secondary);
        line-height: 1.8;
      }
    }

    .event-actions {
      .card {
        position: sticky;
        top: calc(var(--spacing-xl) + 64px);
        padding: var(--spacing-xl);
        text-align: center;

        h3 {
          margin-bottom: var(--spacing-md);
        }

        .price {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: var(--spacing-lg);
        }
      }
    }
  `]
})
export class EventDetailComponent {
  @Input() event!: Event;
} 