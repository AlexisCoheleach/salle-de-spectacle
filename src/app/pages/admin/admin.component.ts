import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockEventService } from '../../services/mock-event.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-container">
      <header class="admin-header">
        <div class="container">
          <h1>Administration</h1>
          <div class="admin-actions">
            <button class="btn btn-primary" routerLink="/admin/events/new">
              Nouvel événement
            </button>
            <button class="btn btn-secondary" (click)="logout()">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main class="container">
        <section class="events-section">
          <h2>Événements</h2>
          
          <div class="events-list" *ngIf="!isLoading; else loading">
            <div class="event-card" *ngFor="let event of events">
              <div class="event-header">
                <img [src]="event.imageUrl || 'assets/images/placeholder.jpg'" [alt]="event.title">
                <div class="event-status" [class.published]="event.published">
                  {{ event.published ? 'Publié' : 'Brouillon' }}
                </div>
              </div>
              
              <div class="event-content">
                <h3>{{ event.title }}</h3>
                <p class="event-date">{{ event.date }}</p>
                <p class="event-price">{{ event.price }}€</p>
                
                <div class="event-actions">
                  <button class="btn btn-secondary" [routerLink]="['/admin/events', event.id, 'edit']">
                    Modifier
                  </button>
                  <button class="btn btn-danger" (click)="deleteEvent(event)">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ng-template #loading>
            <div class="loading">
              Chargement des événements...
            </div>
          </ng-template>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .admin-container {
      min-height: 100vh;
      background-color: var(--background);
    }

    .admin-header {
      background-color: var(--background-card);
      padding: var(--spacing-lg) 0;
      margin-bottom: var(--spacing-xl);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      h1 {
        margin: 0;
        color: var(--text-primary);
      }
    }

    .admin-actions {
      display: flex;
      gap: var(--spacing-md);
    }

    .events-section {
      h2 {
        margin-bottom: var(--spacing-xl);
        color: var(--text-primary);
      }
    }

    .events-list {
      display: grid;
      gap: var(--spacing-lg);
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }

    .event-card {
      background-color: var(--background-card);
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      transition: var(--transition-base);

      &:hover {
        transform: translateY(-4px);
      }
    }

    .event-header {
      position: relative;
      height: 200px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .event-status {
        position: absolute;
        top: var(--spacing-sm);
        right: var(--spacing-sm);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--border-radius-sm);
        background-color: var(--background-card);
        color: var(--text-secondary);
        font-size: 0.875rem;

        &.published {
          background-color: #28a745;
          color: white;
        }
      }
    }

    .event-content {
      padding: var(--spacing-lg);

      h3 {
        margin: 0 0 var(--spacing-sm);
        color: var(--text-primary);
      }

      .event-date,
      .event-price {
        color: var(--text-secondary);
        font-size: 0.875rem;
        margin-bottom: var(--spacing-xs);
      }
    }

    .event-actions {
      display: flex;
      gap: var(--spacing-sm);
      margin-top: var(--spacing-md);
    }

    .loading {
      text-align: center;
      padding: var(--spacing-xl);
      color: var(--text-secondary);
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;

      &:hover {
        background-color: darken(#dc3545, 10%);
      }
    }
  `]
})
export class AdminComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  isLoading = true;
  private authSubscription: Subscription = new Subscription();

  constructor(
    private eventService: MockEventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.user$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/admin/login']);
      }
    });
    this.loadEvents();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async loadEvents() {
    try {
      const events = await firstValueFrom(this.eventService.getEvents());
      this.events = events || [];
    } catch (error) {
      console.error('Error loading events:', error);
      this.events = [];
    } finally {
      this.isLoading = false;
    }
  }

  async deleteEvent(event: Event) {
    if (!event.id || !confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${event.title}" ?`)) {
      return;
    }

    try {
      await this.eventService.deleteEvent(event.id);
      this.events = this.events.filter(e => e.id !== event.id);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Une erreur est survenue lors de la suppression de l\'événement');
    }
  }

  logout() {
    this.authService.logout().subscribe();
  }
} 