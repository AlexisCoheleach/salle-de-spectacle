import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Event, EventCategory, EventStatus, Artist } from '../../../models/event.model';
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
          <!-- Informations de base -->
          <div class="form-section">
            <h2>Informations de base</h2>
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

            <div class="form-group">
              <label for="category">Catégorie *</label>
              <select
                id="category"
                formControlName="category"
                [class.error]="isFieldInvalid('category')"
              >
                <option value="">Sélectionnez une catégorie</option>
                <option *ngFor="let category of eventCategories" [value]="category">
                  {{ category }}
                </option>
              </select>
              <div class="error-message" *ngIf="isFieldInvalid('category')">
                La catégorie est requise
              </div>
            </div>

            <div class="form-group">
              <label for="tags">Tags</label>
              <input
                type="text"
                id="tags"
                formControlName="tags"
                placeholder="Tags séparés par des virgules"
              >
            </div>
          </div>

          <!-- Date et heure -->
          <div class="form-section">
            <h2>Date et heure</h2>
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
                <label for="time">Heure *</label>
                <input
                  type="time"
                  id="time"
                  formControlName="time"
                  [class.error]="isFieldInvalid('time')"
                >
                <div class="error-message" *ngIf="isFieldInvalid('time')">
                  L'heure est requise
                </div>
              </div>

              <div class="form-group">
                <label for="duration">Durée (minutes) *</label>
                <input
                  type="number"
                  id="duration"
                  formControlName="duration"
                  [class.error]="isFieldInvalid('duration')"
                  min="1"
                >
                <div class="error-message" *ngIf="isFieldInvalid('duration')">
                  La durée est requise
                </div>
              </div>
            </div>
          </div>

          <!-- Lieu -->
          <div class="form-section">
            <h2>Lieu</h2>
            <div class="form-group">
              <label for="location">Nom du lieu *</label>
              <input
                type="text"
                id="location"
                formControlName="location"
                [class.error]="isFieldInvalid('location')"
                placeholder="Nom du lieu"
              >
              <div class="error-message" *ngIf="isFieldInvalid('location')">
                Le lieu est requis
              </div>
            </div>

            <div class="form-group">
              <label for="address">Adresse *</label>
              <input
                type="text"
                id="address"
                formControlName="address"
                [class.error]="isFieldInvalid('address')"
                placeholder="Adresse complète"
              >
              <div class="error-message" *ngIf="isFieldInvalid('address')">
                L'adresse est requise
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="city">Ville *</label>
                <input
                  type="text"
                  id="city"
                  formControlName="city"
                  [class.error]="isFieldInvalid('city')"
                  placeholder="Ville"
                >
                <div class="error-message" *ngIf="isFieldInvalid('city')">
                  La ville est requise
                </div>
              </div>

              <div class="form-group">
                <label for="postalCode">Code postal *</label>
                <input
                  type="text"
                  id="postalCode"
                  formControlName="postalCode"
                  [class.error]="isFieldInvalid('postalCode')"
                  placeholder="Code postal"
                >
                <div class="error-message" *ngIf="isFieldInvalid('postalCode')">
                  Le code postal est requis
                </div>
              </div>
            </div>
          </div>

          <!-- Tarifs et places -->
          <div class="form-section">
            <h2>Tarifs et places</h2>
            <div class="form-row">
              <div class="form-group">
                <label for="price">Prix normal *</label>
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

              <div class="form-group">
                <label for="reducedPrice">Prix réduit</label>
                <input
                  type="number"
                  id="reducedPrice"
                  formControlName="reducedPrice"
                  min="0"
                  step="0.01"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="maxCapacity">Capacité maximale *</label>
                <input
                  type="number"
                  id="maxCapacity"
                  formControlName="maxCapacity"
                  [class.error]="isFieldInvalid('maxCapacity')"
                  min="1"
                >
                <div class="error-message" *ngIf="isFieldInvalid('maxCapacity')">
                  La capacité est requise
                </div>
              </div>

              <div class="form-group">
                <label for="availableSeats">Places disponibles *</label>
                <input
                  type="number"
                  id="availableSeats"
                  formControlName="availableSeats"
                  [class.error]="isFieldInvalid('availableSeats')"
                  min="0"
                >
                <div class="error-message" *ngIf="isFieldInvalid('availableSeats')">
                  Le nombre de places disponibles est requis
                </div>
              </div>
            </div>
          </div>

          <!-- Artistes -->
          <div class="form-section">
            <h2>Artistes</h2>
            <div formArrayName="artists">
              <div *ngFor="let artist of artists.controls; let i = index" [formGroupName]="i" class="artist-form">
                <div class="form-row">
                  <div class="form-group">
                    <label [for]="'artistName' + i">Nom *</label>
                    <input
                      type="text"
                      [id]="'artistName' + i"
                      formControlName="name"
                      placeholder="Nom de l'artiste"
                    >
                  </div>
                  <div class="form-group">
                    <label [for]="'artistRole' + i">Rôle *</label>
                    <input
                      type="text"
                      [id]="'artistRole' + i"
                      formControlName="role"
                      placeholder="Rôle dans l'événement"
                    >
                  </div>
                  <button type="button" class="btn btn-danger" (click)="removeArtist(i)">Supprimer</button>
                </div>
                <div class="form-group">
                  <label [for]="'artistBio' + i">Biographie</label>
                  <textarea
                    [id]="'artistBio' + i"
                    formControlName="bio"
                    rows="3"
                    placeholder="Biographie de l'artiste"
                  ></textarea>
                </div>
              </div>
              <button type="button" class="btn btn-secondary" (click)="addArtist()">Ajouter un artiste</button>
            </div>
          </div>

          <!-- Image -->
          <div class="form-section">
            <h2>Image</h2>
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
          </div>

          <!-- Statut -->
          <div class="form-section">
            <h2>Statut</h2>
            <div class="form-group">
              <label for="status">Statut de l'événement *</label>
              <select
                id="status"
                formControlName="status"
                [class.error]="isFieldInvalid('status')"
              >
                <option *ngFor="let status of eventStatuses" [value]="status">
                  {{ getStatusLabel(status) }}
                </option>
              </select>
              <div class="error-message" *ngIf="isFieldInvalid('status')">
                Le statut est requis
              </div>
            </div>

            <div class="form-group" *ngIf="eventForm.get('status')?.value === 'CANCELLED'">
              <label for="cancellationReason">Raison de l'annulation</label>
              <textarea
                id="cancellationReason"
                formControlName="cancellationReason"
                rows="3"
                placeholder="Raison de l'annulation"
              ></textarea>
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

    .form-section {
      margin-bottom: var(--spacing-xl);
      padding-bottom: var(--spacing-xl);
      border-bottom: 1px solid var(--border-color);

      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }

      h2 {
        color: var(--text-primary);
        margin-bottom: var(--spacing-lg);
        font-size: 1.25rem;
      }
    }

    .form-group {
      margin-bottom: var(--spacing-lg);

      label {
        display: block;
        margin-bottom: var(--spacing-xs);
        color: var(--text-secondary);
      }

      input,
      textarea,
      select {
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
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

    .artist-form {
      background-color: var(--background);
      padding: var(--spacing-lg);
      border-radius: var(--border-radius-sm);
      margin-bottom: var(--spacing-md);
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
  eventCategories = Object.values(EventCategory);
  eventStatuses = Object.values(EventStatus);

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
      category: ['', Validators.required],
      tags: [''],
      date: ['', Validators.required],
      time: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      reducedPrice: [0, Validators.min(0)],
      maxCapacity: [0, [Validators.required, Validators.min(1)]],
      availableSeats: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      artists: this.formBuilder.array([]),
      status: [EventStatus.DRAFT, Validators.required],
      cancellationReason: [''],
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

  get artists() {
    return this.eventForm.get('artists') as FormArray;
  }

  addArtist() {
    const artistGroup = this.formBuilder.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      bio: [''],
      imageUrl: ['']
    });
    this.artists.push(artistGroup);
  }

  removeArtist(index: number) {
    this.artists.removeAt(index);
  }

  getStatusLabel(status: EventStatus): string {
    switch (status) {
      case EventStatus.DRAFT:
        return 'Brouillon';
      case EventStatus.PUBLISHED:
        return 'Publié';
      case EventStatus.CANCELLED:
        return 'Annulé';
      case EventStatus.SOLD_OUT:
        return 'Complet';
      case EventStatus.POSTPONED:
        return 'Reporté';
      default:
        return status;
    }
  }

  private async loadEvent() {
    if (!this.eventId) return;
    try {
      const event = await firstValueFrom(this.eventService.getEvent(this.eventId));
      
      // Charger les artistes
      if (event.artists) {
        event.artists.forEach(artist => {
          this.addArtist();
        });
      }
      
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
        id: this.eventId || undefined,
        createdAt: this.isEditMode ? formData.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: this.isEditMode ? formData.createdBy : 'current-user-id', // À remplacer par l'ID de l'utilisateur connecté
        time: formData.time || '20:00',
        duration: formData.duration || 120,
        address: formData.address || '',
        city: formData.city || '',
        postalCode: formData.postalCode || '',
        reducedPrice: formData.reducedPrice || 0,
        maxCapacity: formData.maxCapacity || 100,
        availableSeats: formData.availableSeats || formData.maxCapacity || 100,
        category: formData.category || EventCategory.CONCERT,
        artists: formData.artists || [],
        tags: formData.tags || [],
        status: formData.status || EventStatus.DRAFT,
        published: formData.published || false
      };

      if (this.isEditMode) {
        await this.eventService.updateEvent(eventData);
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