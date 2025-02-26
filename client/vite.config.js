import { defineConfig,loadEnv  } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {

  const env = loadEnv(mode, process.cwd(), '')
  return {
    build: {
      outDir: 'build',
      sourcemap: process.env.GENERATE_SOURCEMAP === 'true',
      emptyOutDir: true,
      rollupOptions: {
        input: ['./src/index', './index.html']
      },
    },
    plugins: [react()],
    server: {
      open: true,
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_SERVER_URL,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      },
    },
  }
});