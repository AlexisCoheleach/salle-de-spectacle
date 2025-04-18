import { Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/admin/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: AccueilComponent
  },
  {
    path: 'evenements',
    loadComponent: () => import('./pages/events/events.component').then(m => m.EventsComponent)
  },
  {
    path: 'evenements/:id',
    loadComponent: () => import('./pages/event-details/event-details.component').then(m => m.EventDetailsComponent)
  },
  {
    path: 'a-propos',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'mentions-legales',
    loadComponent: () => import('./pages/legal/legal.component').then(m => m.LegalComponent)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent)
      },
      {
        path: 'events/new',
        loadComponent: () => import('./pages/admin/event-form/event-form.component').then(m => m.EventFormComponent)
      },
      {
        path: 'events/:id/edit',
        loadComponent: () => import('./pages/admin/event-form/event-form.component').then(m => m.EventFormComponent)
      }
    ]
  },
  {
    path: 'admin/login',
    component: LoginComponent
  }
];
