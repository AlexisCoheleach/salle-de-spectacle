const fs = require('fs');
const path = require('path');

// Créer le dossier events s'il n'existe pas
const eventsDir = path.join(__dirname, '../src/assets/images/events');
if (!fs.existsSync(eventsDir)) {
  fs.mkdirSync(eventsDir, { recursive: true });
}

// Fonction pour sauvegarder une image
function saveImage(fileName, base64Data) {
  // Supprimer le préfixe data:image/...;base64,
  const base64Image = base64Data.split(';base64,').pop();
  
  // Écrire le fichier
  fs.writeFileSync(
    path.join(eventsDir, fileName),
    base64Image,
    { encoding: 'base64' }
  );
  
  console.log(`Image ${fileName} sauvegardée avec succès`);
}

// Écouter les messages du processus parent
process.on('message', (message) => {
  if (message.type === 'saveImage') {
    try {
      saveImage(message.fileName, message.base64Data);
      process.send({ success: true });
    } catch (error) {
      process.send({ success: false, error: error.message });
    }
  }
}); 