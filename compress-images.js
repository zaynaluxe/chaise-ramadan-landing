import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageDir = './';
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

async function optimizeImage(inputPath, outputPath) {
  try {
    const stats = fs.statSync(inputPath);
    const fileSizeInKB = stats.size / 1024;

    console.log(`\n📸 Traitement: ${path.basename(inputPath)}`);
    console.log(`   Taille originale: ${fileSizeInKB.toFixed(2)} KB`);

    // Compresser en WebP avec qualité 80
    await sharp(inputPath)
      .webp({ 
        quality: 80,
        effort: 6 // 0-6, plus élevé = meilleure compression
      })
      .toFile(outputPath);

    const newStats = fs.statSync(outputPath);
    const newFileSizeInKB = newStats.size / 1024;
    const reduction = ((fileSizeInKB - newFileSizeInKB) / fileSizeInKB * 100).toFixed(1);

    console.log(`   ✅ Nouvelle taille: ${newFileSizeInKB.toFixed(2)} KB`);
    console.log(`   📉 Réduction: ${reduction}%`);

  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}`);
  }
}

async function processImages() {
  console.log('\n🚀 DÉMARRAGE DE LA COMPRESSION DES IMAGES\n');
  console.log('=========================================\n');

  const files = fs.readdirSync(imageDir);
  let processedCount = 0;
  let totalOriginalSize = 0;
  let totalNewSize = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    
    if (imageExtensions.includes(ext)) {
      const inputPath = path.join(imageDir, file);
      const baseName = path.basename(file, ext);
      const outputPath = path.join(imageDir, baseName + '.webp');

      // Ne pas recompresser les fichiers déjà en .webp
      if (ext === '.webp') {
        console.log(`\n⏭️  Ignoré: ${file} (déjà en WebP)`);
        continue;
      }

      const beforeStats = fs.statSync(inputPath);
      totalOriginalSize += beforeStats.size;

      await optimizeImage(inputPath, outputPath);

      if (fs.existsSync(outputPath)) {
        const afterStats = fs.statSync(outputPath);
        totalNewSize += afterStats.size;
        processedCount++;
      }
    }
  }

  console.log('\n=========================================');
  console.log('\n📊 RÉSUMÉ DE LA COMPRESSION\n');
  console.log(`   Images traitées: ${processedCount}`);
  console.log(`   Taille totale avant: ${(totalOriginalSize / 1024).toFixed(2)} KB`);
  console.log(`   Taille totale après: ${(totalNewSize / 1024).toFixed(2)} KB`);
  console.log(`   Gain total: ${((totalOriginalSize - totalNewSize) / 1024).toFixed(2)} KB`);
  console.log(`   Réduction: ${((totalOriginalSize - totalNewSize) / totalOriginalSize * 100).toFixed(1)}%`);
  console.log('\n✅ COMPRESSION TERMINÉE !\n');
}

// Redimensionner l'image spécifique d'abord
await resizeSpecificImage();

// Puis traiter les autres images
processImages();
