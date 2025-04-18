import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Event } from '../../../models/event.model';
import { MockEventService } from '../../../services/mock-event.service';
import { firstValueFrom } from 'rxjs';
import { ImageUploadService } from '../../../services/image-upload.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="event-form-container">
      <h1>{{ isEditMode ? "Modifier l'événement" : 'Nouvel événement' }}</h1>
      <div class="container">
        <header class="form-header">
          <button class="btn btn-secondary" (click)="goBack()">Retour</button>
        </header>

        <form [formGroup]="eventForm" (ngSubmit)="onSubmit()" class="event-form">
          <div class="form-group">
            <label for="title">Titre *</label>
            <input
              type="text"
              id="title"
              formControlName="title"
              [class.error]="isFieldInvalid('title')"
              placeholder="Titre de l'événement"
            >
            <div class="error-message" *ngIf="isFieldInvalid('title')">
              Le titre est requis
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description *</label>
            <textarea
              id="description"
              formControlName="description"
              [class.error]="isFieldInvalid('description')"
              placeholder="Description de l'événement"
              rows="5"
            ></textarea>
            <div class="error-message" *ngIf="isFieldInvalid('description')">
              La description est requise
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="date">Date *</label>
              <input
                type="date"
                id="date"
                formControlName="date"
                [class.error]="isFieldInvalid('date')"
              >
              <div class="error-message" *ngIf="isFieldInvalid('date')">
                La date est requise
              </div>
            </div>

            <div class="form-group">
              <label for="price">Prix *</label>
              <input
                type="number"
                id="price"
                formControlName="price"
                [class.error]="isFieldInvalid('price')"
                min="0"
                step="0.01"
              >
              <div class="error-message" *ngIf="isFieldInvalid('price')">
                Le prix est requis
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="location">Lieu *</label>
            <input
              type="text"
              id="location"
              formControlName="location"
              [class.error]="isFieldInvalid('location')"
              placeholder="Lieu de l'événement"
            >
            <div class="error-message" *ngIf="isFieldInvalid('location')">
              Le lieu est requis
            </div>
          </div>

          <div class="form-group">
            <label for="image">Image de l'événement</label>
            <input 
              type="file" 
              id="image" 
              (change)="onFileSelected($event)"
              accept="image/*"
              class="form-control"
            >
            <div *ngIf="previewUrl" class="image-preview">
              <img [src]="previewUrl" alt="Aperçu de l'image">
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                formControlName="published"
              >
              Publier l'événement
            </label>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="goBack()">
              Annuler
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="eventForm.invalid || isLoading">
              {{ isLoading ? 'Enregistrement...' : (isEditMode ? 'Modifier' : 'Créer') }}
            </button>
          </div>

          <div class="error-message" *ngIf="error">
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .event-form-container {
      padding: var(--spacing-xl) 0;
      min-height: 100vh;
      background-color: var(--background);
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);

      h1 {
        margin: 0;
        color: var(--text-primary);
      }
    }

    .event-form {
      background-color: var(--background-card);
      padding: var(--spacing-xl);
      border-radius: var(--border-radius-lg);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: var(--spacing-lg);

      label {
        display: block;
        margin-bottom: var(--spacing-xs);
        color: var(--text-secondary);
      }

      input,
      textarea {
        width: 100%;
        padding: var(--spacing-sm);
        border: 1px solid var(--text-secondary);
        border-radius: var(--border-radius-sm);
        background-color: var(--background);
        color: var(--text-primary);
        transition: var(--transition-base);

        &:focus {
          outline: none;
          border-color: var(--primary);
        }

        &.error {
          border-color: #dc3545;
        }
      }

      textarea {
        resize: vertical;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      cursor: pointer;

      input[type="checkbox"] {
        width: auto;
      }
    }

    .form-actions {
      display: flex;
      gap: var(--spacing-md);
      margin-top: var(--spacing-xl);
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: var(--spacing-xs);
    }

    .image-preview {
      margin-top: 1rem;
      
      img {
        max-width: 200px;
        max-height: 200px;
        object-fit: cover;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }
  `]
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  isEditMode = false;
  private eventId: string | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private eventService: MockEventService,
    private imageUploadService: ImageUploadService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      published: [false]
    });
  }

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.eventId;
    if (this.isEditMode) {
      this.loadEvent();
    }
  }

  private async loadEvent() {
    if (!this.eventId) return;
    try {
      const event = await firstValueFrom(this.eventService.getEvent(this.eventId));
      this.eventForm.patchValue(event);
      this.previewUrl = event.imageUrl;
    } catch (error) {
      this.error = 'Erreur lors du chargement de l\'événement';
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.eventForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Afficher la prévisualisation
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    if (this.eventForm.invalid) return;
    this.isLoading = true;
    this.error = null;

    try {
      let imageUrl = this.eventForm.get('imageUrl')?.value;

      // Si une nouvelle image est sélectionnée, l'uploader
      if (this.selectedFile) {
        imageUrl = await this.imageUploadService.uploadEventImage(this.selectedFile).toPromise();
        this.eventForm.patchValue({ imageUrl });
      }

      const formData = this.eventForm.value;
      const eventData: Event = {
        ...formData,
        id: this.eventId || undefined
      };

      if (this.isEditMode) {
        await this.eventService.updateEvent(this.eventId!, eventData);
      } else {
        await this.eventService.addEvent(eventData);
      }
      await this.router.navigate(['/admin']);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      this.error = 'Erreur lors de l\'enregistrement de l\'événement';
    } finally {
      this.isLoading = false;
    }
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
} 