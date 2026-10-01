import { defineConfig } from 'vite';

// Relative assets support GitHub project Pages and local previews.
export default defineConfig({ base: './', build: { rollupOptions: { input: { game: 'index.html', balance: 'balance.html' } } } });
