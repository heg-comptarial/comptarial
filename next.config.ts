import path from 'path';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    // Résoudre l'alias @ vers le dossier src
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'), // Cela doit correspondre à la structure de ton projet
    };
    return config;
  },
};

export default nextConfig;
