import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider, CssBaseline } from '@mui/material';
import getTheme from './theme';
import { AppProvider, useApp } from './context/AppContext.jsx'

function ThemedApp() {
  const { mode } = useApp()
  const theme = getTheme(mode)
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <ThemedApp />
    </AppProvider>
  </StrictMode>,
)
