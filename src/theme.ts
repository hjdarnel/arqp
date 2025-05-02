'use client';
import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#BF2441' },
    secondary: { main: '#bf5524' },
    action: {
      disabledBackground: '#eaeaea',
      disabled: '#c0c0c0',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif',
    ].join(','),
  },
});

export default theme;
