import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		allowedHosts: ['dev.tomaskrivda.online', 'localhost'],
		fs: { allow: ['static', 'src'] }
	},
	build: {
		rollupOptions: {
			output: { assetFileNames: 'assets/[name][extname]' }
		},
		serviceWorker: false
	},
	optimizeDeps: { exclude: ['@sveltejs/kit'] },
	ssr: {
		noExternal: process.env.NODE_ENV === 'production' ? ['@carbon/charts'] : []
	}
});
