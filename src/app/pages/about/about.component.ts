import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="about-page">
      <div class="container">
        <h1>À propos de Scène Libre</h1>
        <div class="about-content">
          <p>Scène Libre est une plateforme dédiée à la promotion et à la gestion des événements culturels. Notre mission est de rendre la culture accessible à tous en proposant une large gamme d'événements de qualité.</p>
          
          <h2>Notre histoire</h2>
          <p>Fondée en 2024, Scène Libre est née de la passion pour les arts et la culture. Nous croyons que chaque événement culturel est une opportunité de partage et d'enrichissement.</p>
          
          <h2>Nos valeurs</h2>
          <ul>
            <li>Accessibilité : rendre la culture accessible à tous</li>
            <li>Qualité : proposer des événements de qualité</li>
            <li>Innovation : utiliser la technologie pour améliorer l'expérience culturelle</li>
            <li>Engagement : soutenir les artistes et les acteurs culturels</li>
          </ul>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .about-page {
      padding: var(--spacing-xl) 0;
      min-height: 100vh;
      background-color: var(--background);
    }

    h1 {
      color: var(--text-primary);
      margin-bottom: var(--spacing-xl);
    }

    .about-content {
      background-color: var(--background-card);
      padding: var(--spacing-xl);
      border-radius: var(--border-radius-lg);

      h2 {
        color: var(--text-primary);
        margin: var(--spacing-xl) 0 var(--spacing-md);
      }

      p {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: var(--spacing-md);
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          color: var(--text-secondary);
          padding: var(--spacing-sm) 0;
          padding-left: var(--spacing-lg);
          position: relative;

          &::before {
            content: '•';
            position: absolute;
            left: 0;
            color: var(--primary);
          }
        }
      }
    }
  `]
})
export class AboutComponent {} 