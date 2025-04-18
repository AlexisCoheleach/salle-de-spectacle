import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="legal-page">
      <div class="container">
        <h1>Mentions légales</h1>
        <div class="legal-content">
          <section>
            <h2>Informations légales</h2>
            <p>Scène Libre est une plateforme de gestion d'événements culturels.</p>
            <p>Siège social : 123 Rue de la Culture, 75000 Paris</p>
            <p>Email : contact&#64;scene-libre.fr</p>
          </section>

          <section>
            <h2>Hébergement</h2>
            <p>Ce site est hébergé par :</p>
            <p>Nom de l'hébergeur</p>
            <p>Adresse de l'hébergeur</p>
          </section>

          <section>
            <h2>Propriété intellectuelle</h2>
            <p>Tous les contenus présents sur ce site sont protégés par les lois relatives à la propriété intellectuelle.</p>
          </section>

          <section>
            <h2>Protection des données personnelles</h2>
            <p>Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au Règlement général sur la protection des données (RGPD), vous disposez d'un droit d'accès, de rectification, de portabilité et d'effacement de vos données ou encore de limitation du traitement.</p>
          </section>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .legal-page {
      padding: var(--spacing-xl) 0;
      min-height: 100vh;
      background-color: var(--background);
    }

    h1 {
      color: var(--text-primary);
      margin-bottom: var(--spacing-xl);
    }

    .legal-content {
      background-color: var(--background-card);
      padding: var(--spacing-xl);
      border-radius: var(--border-radius-lg);

      section {
        margin-bottom: var(--spacing-xl);

        &:last-child {
          margin-bottom: 0;
        }

        h2 {
          color: var(--text-primary);
          margin-bottom: var(--spacing-md);
        }

        p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: var(--spacing-sm);

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  `]
})
export class LegalComponent {} 