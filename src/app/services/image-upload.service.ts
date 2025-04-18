import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  constructor() {}

  uploadEventImage(file: File): Observable<string> {
    return new Observable(observer => {
      // Vérifier la taille du fichier (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        observer.error('L\'image est trop volumineuse. Taille maximale : 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Générer un nom de fichier unique
        const timestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substring(2, 8);
        const fileName = `event_${timestamp}_${randomString}.${file.name.split('.').pop()}`;
        
        // Créer un lien pour l'image
        const imageUrl = `/assets/images/events/${fileName}`;
        
        // Convertir l'image en base64
        const base64Image = e.target.result;
        
        // Envoyer l'image au serveur
        fetch('http://localhost:3000/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName,
            base64Data: base64Image
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors de l\'upload de l\'image');
          }
          return response.json();
        })
        .then(data => {
          if (data.success) {
            observer.next(imageUrl);
            observer.complete();
          } else {
            observer.error(data.error || 'Erreur lors de l\'upload de l\'image');
          }
        })
        .catch(error => {
          console.error('Upload error:', error);
          observer.error('Erreur lors de l\'upload de l\'image. Veuillez réessayer.');
        });
      };

      reader.onerror = () => {
        observer.error('Erreur lors de la lecture du fichier');
      };

      reader.readAsDataURL(file);
    });
  }
} 