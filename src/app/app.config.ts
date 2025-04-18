import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    {
      provide: 'FIREBASE_APP',
      useFactory: () => {
        const app = initializeApp(environment.firebase);
        const firestore = getFirestore(app);
        if (typeof window !== 'undefined') {
          enableIndexedDbPersistence(firestore).catch((err) => {
            if (err.code === 'failed-precondition') {
              console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
            } else if (err.code === 'unimplemented') {
              console.log('The current browser doesn\'t support persistence.');
            }
          });
        }
        return app;
      }
    }
  ]
};
