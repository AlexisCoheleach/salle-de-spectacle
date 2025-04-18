import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockEventService } from '../../services/mock-event.service';
import { EventListComponent } from '../../shared/components/event-list/event-list.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, EventListComponent],
  template: `
    <main class="events-page">
      <div class="container">
        <h1>Nos Événements</h1>
        <app-event-list></app-event-list>
      </div>
    </main>
  `,
  styles: [`
    .events-page {
      padding: var(--spacing-xl) 0;
      min-height: 100vh;
      background-color: var(--background);
    }

    h1 {
      color: var(--text-primary);
      margin-bottom: var(--spacing-xl);
    }
  `]
})
export class EventsComponent implements OnInit {
  constructor(private eventService: MockEventService) {}

  ngOnInit() {
    // Le composant parent n'a plus besoin de charger les événements
    // car le composant EventList le fait lui-même
  }
} 