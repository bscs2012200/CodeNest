// vite.config.js
import VitePluginReact from '@vitejs/plugin-react';

export default {
  plugins: [VitePluginReact()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
};
