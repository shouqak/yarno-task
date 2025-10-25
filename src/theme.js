import { createTheme } from '@mui/material/styles';

export function getTheme(mode = 'light') {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#2E7D32',
        light: '#60AD5E',
        dark: '#1B5E20',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#00897B',
        light: '#4FB3BF',
        dark: '#00695C',
        contrastText: '#FFFFFF',
      },
      background: isDark
        ? {
            default: '#0E141A',
            paper: '#141B22',
          }
        : {
            default: '#F5F7F8',
            paper: '#FFFFFF',
          },
      text: isDark
        ? {
            primary: '#E3E9EF',
            secondary: '#A6B1C0',
          }
        : {
            primary: '#1A202C',
            secondary: '#4A5568',
          },
      success: { main: '#43A047' },
      error: { main: '#E53935' },
      warning: { main: '#FB8C00' },
      info: { main: '#26A69A' },
    },
    typography: {
      fontFamily: "Funnel Display, sans-serif",
      h1: { fontWeight: 700, fontSize: '2.5rem', color: isDark ? '#E2E8F0' : '#1A202C' },
      h2: { fontWeight: 600, fontSize: '2rem' },
      h3: { fontWeight: 600 },
      body1: { lineHeight: 1.7 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '10px 18px',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: isDark
              ? '0 4px 20px rgba(0, 0, 0, 0.4)'
              : '0 4px 16px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
  });
}

export default getTheme;

