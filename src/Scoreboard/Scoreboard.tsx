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
import { getLatestContest } from '../util/get-latest-contest';
import { Submission } from '@prisma/client';
import Results from './Results';

export default function Scoreboard() {
  const [results, setResults] = useState<Submission[]>([]);
  const [filteredResults, setFilteredResults] = useState<Submission[]>([]);

  const updateFilteredResults = (category: string) => {
    setFilteredResults(
      results?.filter((x) => {
        if (!category || category === 'All Categories') return true;
        return x.category === category;
      })
    );
  };

  useEffect(() => {
    const ac = new AbortController();

    getLatestContest(ac)
      .then((response) => getAllResultsByContest(ac, response.id))
      .then((results) => {
        setResults(results);
        setFilteredResults(results);
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          `Error retrieving the current results! Please contact arkansasqsoparty@gmail.com for help. \n\n${err}`,
          { duration: 6000 }
        );
      });

    return () => {
      setResults([]);
      setFilteredResults([]);
      ac.abort();
    };
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
          <Grid item xs={12} sm={12} md={7} lg={8}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 340
              }}
            >
              <Chart submissions={filteredResults} />
            </Paper>
          </Grid>
          {/* Overview */}
          <Grid item xs={12} sm={12} md={5} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 340
              }}
            >
              <Overview
                submissions={filteredResults || []}
                updateFilteredResults={updateFilteredResults}
              />
            </Paper>
          </Grid>
          {/* Results */}
          <Grid item xs={12} sm={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Results submissions={filteredResults} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
