import { Grid2, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import toast from 'react-hot-toast';
import { getAllContests } from '~/server/contests';
import ExportForm from './ExportForm';

export default async function Page() {
  const contests = await getAllContests();

  if (!contests || contests.length === 0) {
    toast.error(
      'Error retrieving contests! Please contact arkansasqsoparty@gmail.com for help.',
      { duration: 6000 }
    );
  }

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: '#f5f5f5',
        flexGrow: 1,
        height: 'auto',
        overflow: 'auto'
      }}
    >
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 'auto'
              }}
            >
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                sx={{ mb: 2 }}
              >
                Export Contest Results
              </Typography>

              {contests.length > 0 && <ExportForm contests={contests} />}
              <Typography
                variant="body2"
                color="text.secondary"
                align="left"
                sx={{ mt: 2 }}
              >
                Select a contest to export the entire result set as a CSV.
              </Typography>
            </Paper>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
}
