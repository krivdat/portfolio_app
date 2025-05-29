import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sharp from 'sharp';

// Ensure directories exist
function ensureDirectoryExists(filePath) {
	const dir = dirname(filePath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

const __dirname = dirname(fileURLToPath(import.meta.url));

async function convertSvgToPng(svgPath, pngPath, size) {
	try {
		if (!fs.existsSync(svgPath)) {
			console.error(`Source SVG file not found: ${svgPath}`);
			return;
		}
		ensureDirectoryExists(pngPath);

		const svg = `<?xml version="1.0" encoding="UTF-8"?>
            <svg width="${size}" height="${size}" version="1.1" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
                <rect width="${size}" height="${size}" fill="#4a90e2"/>
                <text x="${size / 2}" y="${size * 0.625}" fill="#ffffff" font-family="Arial" font-size="${size * 0.52}" text-anchor="middle">P</text>
            </svg>`;

		await sharp(Buffer.from(svg)).resize(size, size).png().toFile(pngPath);
		console.log(`Successfully created ${pngPath}`);
	} catch (error) {
		console.error('Error creating PNG:', error);
	}
}

// Convert favicon
convertSvgToPng(
	join(__dirname, '../static/favicon.svg'),
	join(__dirname, '../static/favicon.png'),
	32
);

// Convert icon-192x192
convertSvgToPng(
	join(__dirname, '../static/icons/icon-192x192.svg'),
	join(__dirname, '../static/icons/icon-192x192.png'),
	192
);
