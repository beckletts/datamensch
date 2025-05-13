import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import commonjsExternals from 'vite-plugin-commonjs-externals'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react'
    }),
    commonjsExternals({
      externals: ['recharts', 'clsx', '@emotion/styled', '@mui/material']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'react': resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom')
    },
    dedupe: ['react', 'react-dom']
  },
  define: {
    'process.env': {}
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts', 'clsx', '@emotion/styled', '@mui/material'],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  ssr: {
    noExternal: ['recharts', 'clsx', '@emotion/styled', '@mui/material']
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: ['@rollup/rollup-linux-x64-gnu'],
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('recharts') || id.includes('@emotion') || id.includes('@mui')) {
              return 'charts';
            }
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    commonjsOptions: {
      include: [
        /node_modules/,
        /\.js$/,
        /@emotion\/styled/,
        /@mui\/material/
      ],
      transformMixedEsModules: true
    }
  }
})
