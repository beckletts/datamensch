import React from 'react'
import { createRoot } from 'react-dom/client'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import './index.css'
import App from './App'

const emotionCache = createCache({
  key: 'css',
  prepend: true,
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <CacheProvider value={emotionCache}>
      <App />
    </CacheProvider>
  </React.StrictMode>
);
