import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { firstValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-form">
        <h1>Connexion Admin</h1>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              [class.error]="isFieldInvalid('email')"
            >
            <div class="error-message" *ngIf="isFieldInvalid('email')">
              L'email est requis
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              [class.error]="isFieldInvalid('password')"
            >
            <div class="error-message" *ngIf="isFieldInvalid('password')">
              Le mot de passe est requis
            </div>
          </div>

          <div class="error-message" *ngIf="error">
            {{ error }}
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--background);
      padding: var(--spacing-xl);
    }

    .login-form {
      background-color: var(--background-card);
      padding: var(--spacing-xl);
      border-radius: var(--border-radius-lg);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;

      h1 {
        text-align: center;
        margin-bottom: var(--spacing-xl);
        color: var(--text-primary);
      }
    }

    .form-group {
      margin-bottom: var(--spacing-lg);

      label {
        display: block;
        margin-bottom: var(--spacing-xs);
        color: var(--text-secondary);
      }

      input {
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
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: var(--spacing-xs);
    }

    button {
      width: 100%;
      margin-top: var(--spacing-lg);
    }
  `]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  private authSubscription: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Vérifier l'état d'authentification une seule fois au chargement
    this.authSubscription = this.authService.user$.pipe(take(1)).subscribe(user => {
      if (user && this.router.url === '/admin/login') {
        this.router.navigate(['/admin']);
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const { email, password } = this.loginForm.value;
      await firstValueFrom(this.authService.login(email, password));
      // La redirection sera gérée par le service d'authentification
    } catch (error) {
      console.error('Login error:', error);
      this.error = 'Email ou mot de passe incorrect';
    } finally {
      this.isLoading = false;
    }
  }
} 