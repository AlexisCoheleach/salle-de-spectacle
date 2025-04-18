import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <nav class="navbar">
      <div class="container navbar-container">
        <a class="navbar-brand" routerLink="/">
          Scène Libre
        </a>
        
        <button class="navbar-toggle" (click)="toggleMenu()" aria-label="Toggle navigation">
          <span class="navbar-toggle-icon"></span>
        </button>
        
        <div class="navbar-menu" [class.is-active]="isMenuOpen">
          <div class="navbar-start">
            <a class="navbar-item" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              Accueil
            </a>
            <a class="navbar-item" routerLink="/evenements" routerLinkActive="active">
              Évènements
            </a>
            <a class="navbar-item" routerLink="/a-propos" routerLinkActive="active">
              À propos
            </a>
          </div>
          
          <div class="navbar-end">
            <ng-container *ngIf="isLoggedIn">
              <a class="navbar-item admin-link" routerLink="/admin" routerLinkActive="active">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Admin
              </a>
            </ng-container>
            <app-theme-toggle></app-theme-toggle>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: var(--background-card);
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
      transition: var(--transition-theme);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .navbar-brand {
      font-family: var(--font-primary);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      text-decoration: none;
      transition: var(--transition-base);
      margin-right: 2rem;
      
      &:hover {
        color: var(--primary);
      }
    }

    .navbar-toggle {
      display: none;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      
      @media (max-width: 768px) {
        display: block;
      }
    }

    .navbar-toggle-icon {
      display: block;
      width: 24px;
      height: 2px;
      background-color: var(--text-primary);
      position: relative;
      transition: var(--transition-base);
      
      &::before,
      &::after {
        content: '';
        position: absolute;
        width: 24px;
        height: 2px;
        background-color: var(--text-primary);
        transition: var(--transition-base);
      }
      
      &::before {
        top: -6px;
      }
      
      &::after {
        bottom: -6px;
      }
    }

    .navbar-menu {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-grow: 1;
      
      @media (max-width: 768px) {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: var(--background-card);
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        
        &.is-active {
          display: block;
        }
      }
    }

    .navbar-start {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-right: auto;
      
      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 1rem;
        gap: 1rem;
      }
    }

    .navbar-end {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-left: auto;
      
      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }

    .navbar-item {
      color: var(--text-secondary);
      text-decoration: none;
      padding: 0.5rem;
      transition: var(--transition-base);
      
      &:hover {
        color: var(--primary);
      }
      
      &.active {
        color: var(--primary);
        font-weight: 500;
      }
    }

    .admin-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--primary);
      
      svg {
        width: 16px;
        height: 16px;
      }
      
      &:hover {
        color: var(--primary-dark);
      }
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isLoggedIn = false;
  private authSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSubscription = this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
} 