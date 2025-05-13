import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import { mainListItems, secondaryListItems } from './listItems';
import Scoreboard from './Scoreboard/Scoreboard';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Submit from './Submit/Submit';
import Search from './Search/Search';
import Export from './Export/Export';
import { type Contest } from '@prisma/client';
import { getActiveContest } from './util/get-active-contest';
import { getLatestContest } from './util/get-latest-contest';

export default function App() {
  const [currentContest, setCurrentContest] = useState<Contest>();
  const [latestContest, setLatestContest] = useState<Contest>();

  useEffect(() => {
    const ac = new AbortController();

    getActiveContest(ac)
      .then((response) => {
        if (ac.signal.aborted) return;
        setCurrentContest(response);
      })
      .catch((err) => {
        console.error(err);
      });
    return () => {
      setCurrentContest(undefined);
      ac.abort();
    };
  }, []);

  useEffect(() => {
    const ac = new AbortController();

    getLatestContest(ac)
      .then((response) => {
        if (ac.signal.aborted) return;
        setLatestContest(response);
      })
      .catch((err) => {
        console.error(err);
      });
    return () => {
      setLatestContest(undefined);
      ac.abort();
    };
  }, []);

  const Copyright = (props: any) => {
    return (
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
          py: 2,
          px: { xs: '0', sm: '2' }
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ fontSize: { xs: '10px', md: '14px' } }}
          {...props}
        >
          {'Copyright © '}
          <br />
          <Link color="inherit" href="https://github.com/hjdarnel/arqp">
            Henry Darnell
          </Link>{' '}
          {new Date().getFullYear()}
        </Typography>
      </Box>
    );
  };

  const mdTheme = createTheme({
    palette: {
      primary: { main: '#BF2441' },
      secondary: { main: '#bf5524' }
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
        'sans-serif'
      ].join(',')
    }
  });

  const AppContent = () => {
    const navigate = useNavigate();

    return (
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <MuiAppBar position="absolute" sx={{ height: '4rem' }}>
            <Toolbar
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'start', sm: 'center' }
              }}
            >
              <Typography
                variant="h6"
                color="inherit"
                noWrap
                sx={{ textDecoration: 'none', cursor: 'pointer' }}
                onClick={() => navigate('/')}
              >
                {`Arkansas QSO Party ${new Date().getFullYear()}`}
              </Typography>
              <Typography
                color="inherit"
                noWrap
                sx={{
                  textDecoration: 'none',
                  cursor: 'pointer',
                  ml: { xs: '0', sm: '1rem' }
                }}
                onClick={() => location.assign('https://noiseblankers.com')}
              >
                sponsored by the Noise Blankers Radio Group
              </Typography>
            </Toolbar>
          </MuiAppBar>
          <Divider />
          <List component="nav" sx={{ flexShrink: 0 }}>
            <Toolbar />
            {mainListItems(!!currentContest)}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
            <Copyright />
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
              overflow: 'auto'
            }}
          >
            <Routes>
              <Route path="/submit" element={<Submit />}></Route>
              <Route path="/search" element={<Search />}></Route>
              <Route path="/export" element={<Export />}></Route>
              <Route path="/" element={<Scoreboard />}></Route>
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    );
  };

  const StyledAppContent = styled(AppContent)(() => ({
    margin: 0,
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
      'sans-serif'
    ],
    webkitFontSmoothing: 'antialiased',
    mozOsxFontSmoothing: 'grayscale'
  }));

  return <StyledAppContent />;
}
