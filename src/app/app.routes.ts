import { Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { EventsComponent } from './pages/events/events.component';
import { AboutComponent } from './pages/about/about.component';
import { EventDetailsComponent } from './pages/event-details/event-details.component';
import { AdminComponent } from './pages/admin/admin.component';
import { EventFormComponent } from './pages/admin/event-form/event-form.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'evenements', component: EventsComponent },
  { path: 'evenements/:id', component: EventDetailsComponent, data: { skipPrerender: true } },
  { path: 'a-propos', component: AboutComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'admin/events', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'admin/events/new', component: EventFormComponent, canActivate: [AuthGuard] },
  { path: 'admin/events/:id/edit', component: EventFormComponent, canActivate: [AuthGuard], data: { skipPrerender: true } },
  { path: 'admin/events/:id/edit', component: EventFormComponent, canActivate: [AuthGuard], data: { renderMode: 'client' } },
  { path: '**', redirectTo: '' }
];
