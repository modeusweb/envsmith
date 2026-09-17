// @ts-check
/**
 * Generates all favicon sizes and a social preview image from assets/logo.svg.
 * Run: node scripts/generate-icons.mjs
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SVG_PATH = "assets/logo.svg";
const OUT_DIR = "src/app";
const PUBLIC_DIR = "public";

const ICONS = [
  { name: "icon.svg", size: null, dir: OUT_DIR },
  { name: "favicon.ico", size: 32, dir: OUT_DIR },
  { name: "icon.png", size: 512, dir: OUT_DIR },
  { name: "apple-icon.png", size: 180, dir: OUT_DIR },
  { name: "icon-192.png", size: 192, dir: PUBLIC_DIR },
  { name: "icon-512.png", size: 512, dir: PUBLIC_DIR },
];

const SOCIAL = { name: "opengraph-image.png", width: 1200, height: 630, dir: OUT_DIR };

await mkdir(OUT_DIR, { recursive: true });
await mkdir(PUBLIC_DIR, { recursive: true });

const svgBuffer = await readFile(SVG_PATH);

for (const icon of ICONS) {
  if (!icon.size) {
    // copy the vector as-is
    await writeFile(`${icon.dir}/${icon.name}`, svgBuffer);
    await writeFile(`${PUBLIC_DIR}/logo.svg`, svgBuffer);
    console.log(`✓ ${icon.name} + public/logo.svg (vector)`);
    continue;
  }
  const { data, info } = await sharp(svgBuffer, { density: 300 })
    .resize(icon.size, icon.size)
    .png()
    .toBuffer({ resolveWithObject: true });
  await writeFile(`${icon.dir}/${icon.name}`, data);
  console.log(`✓ ${icon.dir}/${icon.name} (${info.width}x${info.height})`);
}

// 1200x630 social preview: logo centered on dark background
const social = await sharp({
  create: {
    width: SOCIAL.width,
    height: SOCIAL.height,
    channels: 4,
    background: { r: 10, g: 14, b: 20, alpha: 1 },
  },
})
  .composite([
    {
      input: await sharp(svgBuffer, { density: 300 }).resize(512, 512).toBuffer(),
      top: Math.round((SOCIAL.height - 512) / 2),
      left: Math.round((SOCIAL.width - 512) / 2),
    },
  ])
  .png()
  .toBuffer();

await writeFile(`${SOCIAL.dir}/${SOCIAL.name}`, social);
console.log(`✓ ${SOCIAL.name} (${SOCIAL.width}x${SOCIAL.height})`);
