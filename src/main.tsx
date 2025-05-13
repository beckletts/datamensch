import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material'
import './index.css'
import App from './App'

// Create the base theme first
const theme = createTheme()

// Ensure emotion cache is created with a stable key and configuration
const cache = createCache({
  key: 'mui',
  prepend: true,
})

// Ensure root element exists
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
)
