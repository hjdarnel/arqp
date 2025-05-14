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
import { Location } from '../util/locations';
import { Category } from '../util/categories';

export type ResultsFilter = {
  category?: Category | 'All Categories';
  location?: Location | 'All Locations';
};

export default function Scoreboard() {
  const [results, setResults] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredResults, setFilteredResults] = useState<Submission[]>([]);

  const updateFilteredResults = ({ category, location }: ResultsFilter) => {
    setFilteredResults(
      results
        ?.filter((x) => {
          if (!category || category === 'All Categories') return true;
          return x.category === category;
        })
        .filter((x) => {
          if (!location || location === 'All Locations') return true;
          return x.contestLocation === location;
        })
    );
  };

  useEffect(() => {
    const ac = new AbortController();

    getLatestContest(ac)
      .then((response) => {
        if (ac.signal.aborted) return [];
        return getAllResultsByContest(ac, response.id);
      })
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
      })
      .finally(() => {
        setIsLoading(false);
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
                isLoading={isLoading}
                submissions={filteredResults || []}
                updateFilteredResults={updateFilteredResults}
              />
            </Paper>
          </Grid>
          {/* Results */}
          <Grid item xs={12} sm={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Results isLoading={isLoading} submissions={filteredResults} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
