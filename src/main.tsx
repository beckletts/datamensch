import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material'
import './index.css'
import App from './App'

const theme = createTheme();

// Create emotion cache with the prefix 'emotion-'
const emotionCache = createCache({
  key: 'emotion-',
  prepend: true,
});

// Ensure root element exists
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <CacheProvider value={emotionCache}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  </React.StrictMode>
);
