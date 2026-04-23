import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  const disableHmr =
    env.DISABLE_HMR === 'true' || process.env.DISABLE_HMR === 'true';
  const hmrHost =
    env.VITE_HMR_HOST || process.env.VITE_HMR_HOST || 'localhost';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // When listening on 0.0.0.0 (`vite --host 0.0.0.0`), the default HMR WebSocket URL can
      // use a hostname the browser cannot open (e.g. 0.0.0.0). Point HMR at localhost for
      // same-machine dev. Set VITE_HMR_HOST in .env when opening the app via a LAN IP.
      hmr: disableHmr ? false : {host: hmrHost},
      open: true,
    },
  };
});
