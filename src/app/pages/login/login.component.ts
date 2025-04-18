import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Connexion</h1>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              [class.error]="isFieldInvalid('email')"
              placeholder="Votre email"
            >
            <div class="error-message" *ngIf="isFieldInvalid('email')">
              Email invalide
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              [class.error]="isFieldInvalid('password')"
              placeholder="Votre mot de passe"
            >
            <div class="error-message" *ngIf="isFieldInvalid('password')">
              Mot de passe requis
            </div>
          </div>

          <div class="error-message" *ngIf="error">
            {{ error }}
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: var(--spacing-xl);
      background-color: var(--background);
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: var(--spacing-xl);
      background-color: var(--background-card);
      border-radius: var(--border-radius-lg);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

      h1 {
        margin-bottom: var(--spacing-xl);
        text-align: center;
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
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--primary);
      color: white;
      border: none;
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      transition: var(--transition-base);

      &:hover:not(:disabled) {
        background-color: var(--primary-dark);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  returnUrl: string = '/admin';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Get return url from route parameters or default to '/admin'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
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
      await this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
      this.router.navigate([this.returnUrl]);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Une erreur est survenue';
    } finally {
      this.isLoading = false;
    }
  }
} 