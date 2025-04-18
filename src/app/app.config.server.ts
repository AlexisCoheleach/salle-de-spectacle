import { ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { HttpClient } from '@angular/common/http';
import { MockEventService } from './services/mock-event.service';
import { AuthService } from './services/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const config: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes),
    {
      provide: AuthService,
      useValue: {
        isAuthenticated: false,
        currentUser: null,
        login: () => Promise.resolve(),
        logout: () => Promise.resolve(),
        getCurrentUser: () => Promise.resolve(null)
      }
    },
    MockEventService
  ]
};

export async function getPrerenderParams(route: string): Promise<string[]> {
  if (route === 'evenements/:id') {
    // Retourner une liste statique d'IDs pour le prerendering
    return ['1', '2', '3'];
  }
  
  if (route === 'admin/events/:id/edit') {
    // Retourner une liste statique d'IDs pour le prerendering
    return ['1', '2', '3'];
  }

  return [];
}
