import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styles: [`
    .footer {
      background-color: var(--footer-dark);
      color: white;
      padding: var(--spacing-xl) 0;
      margin-top: auto;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-xl);
      margin-bottom: var(--spacing-xl);
    }

    .footer-section {
      h3, h4 {
        color: white;
        margin-bottom: var(--spacing-md);
      }

      p {
        color: rgba(255, 255, 255, 0.7);
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          margin-bottom: var(--spacing-sm);
        }

        a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: var(--transition-base);

          &:hover {
            color: white;
          }
        }
      }
    }

    .social-links {
      display: flex;
      gap: var(--spacing-md);

      a {
        color: rgba(255, 255, 255, 0.7);
        transition: var(--transition-base);

        &:hover {
          color: white;
        }
      }
    }

    .footer-bottom {
      padding-top: var(--spacing-lg);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;

      p {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.9rem;
      }
    }

    .admin-link {
      color: inherit;
      text-decoration: none;
      opacity: 0.7;
      transition: opacity 0.3s ease;
      
      &:hover,
      &:focus {
        opacity: 1;
        outline: none;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
} 