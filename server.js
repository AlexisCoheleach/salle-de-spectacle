const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Créer le dossier events s'il n'existe pas
const eventsDir = path.join(__dirname, 'src/assets/images/events');
if (!fs.existsSync(eventsDir)) {
  fs.mkdirSync(eventsDir, { recursive: true });
}

app.post('/upload', async (req, res) => {
  try {
    const { fileName, base64Data } = req.body;
    
    // Supprimer le préfixe data:image/...;base64,
    const base64Image = base64Data.split(';base64,').pop();
    
    // Convertir la base64 en buffer
    const imageBuffer = Buffer.from(base64Image, 'base64');
    
    // Optimiser l'image avec sharp
    const optimizedImage = await sharp(imageBuffer)
      .resize(1200, 800, { // Redimensionner si nécessaire
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 }) // Convertir en JPEG avec une qualité de 80%
      .toBuffer();
    
    // Écrire le fichier optimisé
    fs.writeFileSync(
      path.join(eventsDir, fileName),
      optimizedImage
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 