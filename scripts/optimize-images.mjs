// Converts the Figma exports in assets-src/ into web-ready WebP files in public/img/.
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'assets-src';
const OUT = 'public/img';
await mkdir(OUT, { recursive: true });

for (const file of await readdir(SRC)) {
  if (!file.endsWith('.png')) continue;
  const name = path.basename(file, '.png');
  const img = sharp(path.join(SRC, file));
  const { width, height } = await img.metadata();
  const isPhone = height > width;
  const maxW = isPhone ? 900 : name.startsWith('layer-') || name.startsWith('cover-') ? 1920 : 2400;
  await img
    .resize({ width: Math.min(width, maxW), withoutEnlargement: true })
    .webp({ quality: 84, effort: 5 })
    .toFile(path.join(OUT, `${name}.webp`));
  console.log(`${name}.webp`);
}
