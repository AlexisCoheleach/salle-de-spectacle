import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MockEventService } from '../../services/mock-event.service';
import { Event } from '../../models/event.model';

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
              <p class="event-date">{{ event.date }}</p>
              <p class="event-location">{{ event.location }}</p>
              <p class="event-price">{{ event.price }}€</p>
            </div>
          </div>
          
          <div class="event-description">
            <h2>Description</h2>
            <p>{{ event.description }}</p>
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

      h1 {
        color: var(--text-primary);
        margin-bottom: var(--spacing-md);
      }

      .event-date,
      .event-location,
      .event-price {
        color: var(--text-secondary);
        margin-bottom: var(--spacing-sm);
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
} 