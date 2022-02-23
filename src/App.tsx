import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import red from '@mui/material/colors/red';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import { mainListItems, secondaryListItems } from './listItems';
import Dashboard from './Dashboard';

const Copyright = (props: any) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/hjdarnel">
        Henry Darnell
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const mdTheme = createTheme({
  palette: {
    primary: red,
  },
  typography: {
    fontFamily: ["-apple-system", "BlinkMacSystemFont", 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    "sans-serif"].join(',')
  }
});

const AppContent = () => {
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex'}}>
        <CssBaseline />
        <MuiAppBar position="absolute">
          <Toolbar>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Arkansas QSO Party
            </Typography>
          </Toolbar>
        </MuiAppBar>
        <Divider />
        <List component="nav">
          <Toolbar/>
          {mainListItems}
          <Divider sx={{ my: 1 }} />
          {secondaryListItems}
        </List>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Dashboard></Dashboard>
          <Copyright />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

const StyledAppContent = styled(AppContent)(() => ({
  margin: 0,
  "font-family": ["-apple-system", "BlinkMacSystemFont", 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    "sans-serif"],
  "-webkit-font-smoothing": "antialiased",
  "-moz-osx-font-smoothing": "grayscale"
}));

export default function App() {
  return <AppContent />;
}
