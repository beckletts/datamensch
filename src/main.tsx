import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { StyledEngineProvider } from '@mui/material/styles'
import './index.css'
import App from './App'

// Ensure proper emotion cache initialization
const emotionCache = createCache({
  key: 'css',
  prepend: true,
  speedy: true
});

// Ensure root element exists
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <CacheProvider value={emotionCache}>
        <App />
      </CacheProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);
