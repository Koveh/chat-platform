/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Оптимизация размера чанков для предотвращения ChunkLoadError
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        // Основные библиотеки в отдельном чанке
        framework: {
          name: 'framework',
          test: /[\\/]node_modules[\\/](react|react-dom|next|framer-motion)[\\/]/,
          priority: 40,
          chunks: 'all',
          enforce: true,
        },
        // UI компоненты в отдельном чанке
        ui: {
          name: 'ui',
          test: /[\\/]components[\\/]ui[\\/]/,
          priority: 30,
          chunks: 'all',
          enforce: true,
        },
        // Остальные библиотеки
        lib: {
          test: /[\\/]node_modules[\\/]/,
          priority: 20,
          chunks: 'all',
        },
        // Общий код приложения
        commons: {
          name: 'commons',
          minChunks: 2,
          priority: 10,
          chunks: 'all',
          reuseExistingChunk: true,
        },
      },
      maxInitialRequests: 25,
      minSize: 20000,
      maxSize: 250000,
    };

    return config;
  },
};

module.exports = nextConfig; 