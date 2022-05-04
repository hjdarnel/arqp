import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from './Chart';
import Overview from './Overview';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllResultsByContest } from '../util/get-all-results-by-contest';
import { getContest } from '../util/get-contest';
import { Submission } from '@prisma/client';
import Results from './Results';

export default function Scoreboard() {
  const [results, setResults] = useState<Submission[]>([]);

  useEffect(() => {
    getContest()
      .then((response) => getAllResultsByContest(response.id))
      .then((results) => setResults(results))
      .catch((err) => {
        console.error(err);
        toast.error(
          `Error retrieving the current results! Please contact arkansasqsoparty@gmail.com for help. \n\n${err}`,
          { duration: 6000 }
        );
      });
  }, []);

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: 'auto',
        overflow: 'auto'
      }}
    >
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 340
              }}
            >
              <Chart submissions={results} />
            </Paper>
          </Grid>
          {/* Recent Deposits */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 340
              }}
            >
              <Overview submissions={results || []} />
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Results submissions={results} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
