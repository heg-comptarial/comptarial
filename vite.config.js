import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Import pour résoudre les chemins
import { configDefaults } from 'vitest/config'

// Exporter la configuration complète de Vite
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Configure l'alias '@' pour pointer vers le dossier 'src'
    },
  },
  test: {
    include: [...configDefaults.include, 'src/app/**/*.test.tsx',
      'src/app/page.test.tsx',        // Fichiers de test directement dans src/app

    ], // Inclut les fichiers de tests .test.tsx
    environment: 'jsdom', // Utilise jsdom pour tester les composants React
    globals: true, // Active les globals comme `expect`, `it`, `describe`
    compilerOptions: {
      types: ['vitest/globals'], // Inclut les types globaux de vitest
    },
  },
})
