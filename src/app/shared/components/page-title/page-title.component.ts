import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-title">
      <div class="container">
        <h1>{{ title }}</h1>
        <p *ngIf="subtitle">{{ subtitle }}</p>
      </div>
    </div>
  `,
  styles: [`
    .page-title {
      padding: $spacing-xl 0;
      background-color: var(--background-card);
      margin-bottom: $spacing-xl;

      h1 {
        color: var(--text-primary);
        font-size: 2.5rem;
        margin-bottom: $spacing-sm;
      }

      p {
        color: var(--text-secondary);
        font-size: 1.1rem;
        max-width: 600px;
      }
    }
  `]
})
export class PageTitleComponent {
  @Input() title = '';
  @Input() subtitle?: string;
} 