import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img
      [src]="src"
      [alt]="alt"
      (error)="onError()"
      [class]="className"
    >
  `,
  styles: [`
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `]
})
export class ImageComponent {
  @Input() src: string = '';
  @Input() alt: string = '';
  @Input() className: string = '';
  @Input() fallbackImage: string = '/assets/images/placeholder.png';

  onError() {
    this.src = this.fallbackImage;
  }
} 