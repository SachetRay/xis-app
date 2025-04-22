import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0066CC',
      light: '#3384D7',
      dark: '#004C99',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#9B5DE5',
      light: '#B07DEB',
      dark: '#7A41B8',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#00A76F',
      light: '#33B88C',
      dark: '#007D53',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF4842',
      light: '#FF6B67',
      dark: '#B72136',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFC107',
      light: '#FFD139',
      dark: '#B78A05',
      contrastText: '#212B36',
    },
    info: {
      main: '#00B8D9',
      light: '#33C6E3',
      dark: '#0089A3',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#212B36',
      secondary: '#637381',
      disabled: '#919EAB',
    },
    background: {
      paper: '#FFFFFF',
      default: '#F9FAFB',
    },
    divider: '#919EAB3D',
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.5,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.5,
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.5,
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.5,
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 700,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '6px 16px',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(145, 158, 171, 0.16)',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '24px',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
        },
      },
    },
  },
});

export default theme; 