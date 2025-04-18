import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockEventService } from '../../services/mock-event.service';
import { Event } from '../../models/event.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main>
      <!-- Section Hero -->
      <section class="hero">
        <div class="hero-content">
          <h1>Scène Libre</h1>
          <p class="hero-subtitle">Votre destination pour des moments inoubliables</p>
          <a routerLink="/evenements" class="btn btn-primary">Découvrir les événements</a>
        </div>
      </section>

      <!-- Section Prochains Événements -->
      <section class="upcoming-events">
        <div class="container">
          <h2>Prochains Événements</h2>
          <div class="events-grid">
            <div class="event-card" *ngFor="let event of upcomingEvents">
              <img [src]="event.imageUrl || '/assets/images/placeholder.png'" [alt]="event.title">
              <div class="event-info">
                <h3>{{ event.title }}</h3>
                <p class="event-date">{{ event.date }}</p>
                <p class="event-location">{{ event.location }}</p>
                <a [routerLink]="['/evenements', event.id]" class="btn btn-secondary">En savoir plus</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section À Propos -->
      <section class="about">
        <div class="container">
          <div class="about-content">
            <div class="about-text">
              <h2>Notre Salle de Spectacle</h2>
              <p>Scène Libre est un espace culturel dynamique au cœur de la ville, dédié à la promotion des arts vivants. Notre salle accueille une variété d'événements allant des concerts aux pièces de théâtre, en passant par des spectacles de danse et des performances artistiques.</p>
              <p>Nous nous engageons à offrir une expérience culturelle exceptionnelle dans un cadre chaleureux et convivial.</p>
              <a routerLink="/a-propos" class="btn btn-primary">En savoir plus</a>
            </div>
            <div class="about-image">
              <img src="/assets/images/salle-spectacle.jpg" alt="Notre salle de spectacle">
            </div>
          </div>
        </div>
      </section>

      <!-- Section Contact -->
      <section class="contact">
        <div class="container">
          <h2>Contactez-nous</h2>
          <div class="contact-content">
            <div class="contact-info">
              <div class="contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <p>123 Rue de la Culture<br>75000 Paris</p>
              </div>
              <div class="contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <p>01 23 45 67 89</p>
              </div>
              <div class="contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <p>contact&#64;scene-libre.fr</p>
              </div>
            </div>
            <div class="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.292292615509614!3d48.85837007928746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1645541234567!5m2!1sfr!2sfr"
                width="100%"
                height="300"
                style="border:0;"
                allowfullscreen=""
                loading="lazy">
              </iframe>
            </div>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    main {
      min-height: 100vh;
    }

    /* Section Hero */
    .hero {
      height: 80vh;
      background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/hero-bg.png');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: white;
      padding: var(--spacing-xl);
    }

    .hero-content {
      max-width: 800px;
    }

    .hero h1 {
      font-size: 4rem;
      margin-bottom: var(--spacing-md);
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .hero-subtitle {
      font-size: 1.5rem;
      margin-bottom: var(--spacing-xl);
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }

    /* Section Prochains Événements */
    .upcoming-events {
      padding: var(--spacing-xl) 0;
      background-color: var(--background);
    }

    .upcoming-events h2 {
      text-align: center;
      margin-bottom: var(--spacing-xl);
      color: var(--text-primary);
    }

    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }

    .event-card {
      background-color: var(--background-card);
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      transition: var(--transition-base);

      &:hover {
        transform: translateY(-4px);
      }

      img {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }

      .event-info {
        padding: var(--spacing-lg);

        h3 {
          margin: 0 0 var(--spacing-sm);
          color: var(--text-primary);
        }

        .event-date,
        .event-location {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-sm);
        }
      }
    }

    /* Section À Propos */
    .about {
      padding: var(--spacing-xl) 0;
      background-color: var(--background-alt);
    }

    .about-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-xl);
      align-items: center;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .about-text {
      h2 {
        color: var(--text-primary);
        margin-bottom: var(--spacing-lg);
      }

      p {
        color: var(--text-secondary);
        margin-bottom: var(--spacing-md);
        line-height: 1.6;
      }
    }

    .about-image {
      img {
        width: 100%;
        border-radius: var(--border-radius-lg);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
    }

    /* Section Contact */
    .contact {
      padding: var(--spacing-xl) 0;
      background-color: var(--background);
    }

    .contact h2 {
      text-align: center;
      margin-bottom: var(--spacing-xl);
      color: var(--text-primary);
    }

    .contact-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-xl);

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);

      svg {
        color: var(--primary);
      }

      p {
        color: var(--text-secondary);
        margin: 0;
      }
    }

    .contact-map {
      iframe {
        border-radius: var(--border-radius-lg);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
    }
  `]
})
export class AccueilComponent implements OnInit {
  upcomingEvents: Event[] = [];

  constructor(private eventService: MockEventService) {}

  async ngOnInit() {
    try {
      const events = await firstValueFrom(this.eventService.getEvents());
      // Filtrer les événements passés et ne garder que les 3 prochains
      const now = new Date();
      this.upcomingEvents = events
        .filter(event => new Date(event.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  }
}