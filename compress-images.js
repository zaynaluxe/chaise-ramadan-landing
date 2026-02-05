import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imageDir = './';
const imageExtensions = ['.jpg', '.jpeg', '.png'];

async function convertToWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 80 }) // High compression with quality 80
      .toFile(outputPath);
    console.log(`Converted ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error);
  }
}

async function processImages() {
  const files = fs.readdirSync(imageDir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (imageExtensions.includes(ext)) {
      const inputPath = path.join(imageDir, file);
      const outputPath = path.join(imageDir, path.basename(file, ext) + '.webp');
      await convertToWebP(inputPath, outputPath);
    }
  }
}

processImages();
