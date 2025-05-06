import DashboardIcon from '@mui/icons-material/Dashboard';
import DownloadIcon from '@mui/icons-material/Download';
import PublishIcon from '@mui/icons-material/Publish';
import SearchIcon from '@mui/icons-material/Search';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Toolbar,
  Typography
} from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import Link from 'next/link';
import { getActiveContest, getLatestContest } from '~/server/contests';
import '~/styles/globals.css';
import type { Metadata } from 'next';
import theme from '~/theme';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Arkansas QSO Party',
  icons: [{ rel: 'icon', url: '/favicon.svg' }]
};

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const activeContest = await getActiveContest();
  const latestContest = await getLatestContest();

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="google-site-verification"
          content="nKqKYWkaUg_O-yRP84A-l_ARukt3U2UG1Lz3__jacaU"
        />
        <meta
          name="description"
          content="Scoreboard and submission page for the Arkansas QSO Amateur Radio Party"
        />
        <meta property="og:title" content="Arkansas QSO Party" />
        <meta property="og:url" content="https://arkansasqp.netlify.app" />
        <meta property="og:image" content="/Arkansas-QSO-Party-logo.png" />
        <meta
          property="og:description"
          content="Scoreboard and submission page for the Arkansas QSO Amateur Radio Party"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:creator" content="@hjdarnel" />
        <title>Arkansas QSO Party</title>
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <AppRouterCacheProvider>
            <Box sx={{ display: 'flex' }}>
              <CssBaseline />
              <AppBar position="absolute" sx={{ height: '4rem' }}>
                <Toolbar
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'start', sm: 'center' }
                  }}
                >
                  {/* Intentional A here to hard-refresh */}
                  <a href={'/'}>
                    <Typography
                      variant="h6"
                      color="inherit"
                      noWrap
                      sx={{ textDecoration: 'none', cursor: 'pointer' }}
                    >
                      {activeContest?.title ??
                        latestContest?.title ??
                        `Arkansas QSO Party ${new Date().getFullYear()}`}
                    </Typography>
                  </a>
                  <Link href={'https://noiseblankers.com'}>
                    <Typography
                      color="inherit"
                      noWrap
                      sx={{
                        textDecoration: 'none',
                        cursor: 'pointer',
                        ml: { xs: '0', sm: '1rem' }
                      }}
                    >
                      sponsored by the Noise Blankers Radio Group
                    </Typography>
                  </Link>
                </Toolbar>
              </AppBar>
              <Divider />
              <List component="nav" sx={{ flexShrink: 0 }}>
                <Toolbar />
                <ListItemButton component={Link} href="/">
                  <ListItemIcon sx={{ minWidth: { xs: '26px', md: '65px' } }}>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText
                    sx={{ display: { xs: 'none', md: 'block' } }}
                    primary="Latest Scoreboard"
                  />
                </ListItemButton>
                {!!activeContest && (
                  <ListItemButton component={Link} href="/submit">
                    <ListItemIcon sx={{ minWidth: { xs: '26px', md: '65px' } }}>
                      <PublishIcon />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ display: { xs: 'none', md: 'block' } }}
                      primary="Submit Log"
                    />
                  </ListItemButton>
                )}
                <Divider sx={{ my: 1 }} />
                <ListItemButton component={Link} href="/search">
                  <ListItemIcon sx={{ minWidth: { xs: '26px', md: '65px' } }}>
                    <SearchIcon />
                  </ListItemIcon>
                  <ListItemText
                    sx={{ display: { xs: 'none', md: 'block' } }}
                    primary="Search by Callsign"
                  />
                </ListItemButton>
                <ListItemButton component={Link} href="/export">
                  <ListItemIcon sx={{ minWidth: { xs: '26px', md: '65px' } }}>
                    <DownloadIcon />
                  </ListItemIcon>
                  <ListItemText
                    sx={{ display: { xs: 'none', md: 'block' } }}
                    primary="Export All Results"
                  />
                </ListItemButton>
                <Copyright />
              </List>
              <Box
                component="main"
                sx={{
                  backgroundColor: '#f5f5f5',
                  flexGrow: 1,
                  height: '100vh',
                  overflow: 'auto'
                }}
              >
                {children}
              </Box>
            </Box>
            <Toaster />
          </AppRouterCacheProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

const Copyright = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        bottom: 0,
        pb: 2,
        px: { xs: '0', sm: '2' }
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ fontSize: { xs: '10px', md: '14px' } }}
      >
        <Link href="https://github.com/hjdarnel/arqp">
          &copy;&nbsp;Henry Darnell
        </Link>{' '}
        {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};
