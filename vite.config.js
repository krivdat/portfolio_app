import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		allowedHosts: ['dev.tomaskrivda.online', 'localhost'],
		fs: {
			// Allow serving files from these directories
			allow: ['static', 'src']
		}
	},
	build: {
		rollupOptions: {
			output: {
				assetFileNames: 'assets/[name][extname]'
			}
		},
		serviceWorker: false
	},
	optimizeDeps: {
		exclude: ['@sveltejs/kit']
	}
});
