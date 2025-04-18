import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, from, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence,
  Unsubscribe,
  connectAuthEmulator
} from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private inactivityTimer: any;
  private readonly SESSION_TIMEOUT = 60 * 60 * 1000; // 1 heure en millisecondes
  private activitySubscription?: Subscription;
  private isBrowser: boolean;
  private authStateUnsubscribe?: Unsubscribe;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (environment.useEmulators) {
      connectAuthEmulator(
        auth,
        `http://${environment.emulatorConfig.auth.host}:${environment.emulatorConfig.auth.port}`
      );
    }
    
    // Configurer la persistance locale
    setPersistence(auth, browserLocalPersistence)
      .catch((error) => {
        console.error('Error setting persistence:', error);
      });

    // Écouter les changements d'état d'authentification
    this.authStateUnsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      this.userSubject.next(user);
      if (user && this.isBrowser) {
        this.startInactivityTimer();
        // Rediriger vers le panel admin si l'utilisateur est sur la page de login
        if (this.router.url === '/admin/login') {
          this.router.navigate(['/admin']);
        }
      } else {
        this.stopInactivityTimer();
        // Rediriger vers la page de login si l'utilisateur n'est pas authentifié
        if (this.router.url.startsWith('/admin') && this.router.url !== '/admin/login') {
          this.router.navigate(['/admin/login']);
        }
      }
    });

    if (this.isBrowser) {
      this.setupActivityListeners();
    }
  }

  ngOnDestroy() {
    if (this.authStateUnsubscribe) {
      this.authStateUnsubscribe();
    }
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
    }
    this.stopInactivityTimer();
  }

  private setupActivityListeners() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, () => this.resetInactivityTimer());
    });
  }

  private startInactivityTimer() {
    this.stopInactivityTimer();
    this.inactivityTimer = setTimeout(() => {
      this.logout().subscribe();
    }, this.SESSION_TIMEOUT);
  }

  private stopInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
  }

  private resetInactivityTimer() {
    this.startInactivityTimer();
  }

  login(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        if (this.isBrowser) {
          this.startInactivityTimer();
        }
        return userCredential.user;
      }));
  }

  logout(): Observable<void> {
    this.stopInactivityTimer();
    return from(signOut(auth).then(() => {
      this.router.navigate(['/admin/login']);
    }));
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }
} 