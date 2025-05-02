import { Box, Container, Grid, Paper, Toolbar } from '@mui/material';
import { getLatestContestSubmissions } from '~/server/submissions';
import type { Category } from '~/util/categories';
import type { Location } from '~/util/locations';
import Results from '../shared/Results';
import Chart from './Chart';
import Overview from './Overview';

export default async function Scoreboard({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const category = (
    Array.isArray(params.category) ? params.category[0] : params.category
  ) as Category | undefined;
  const location = (
    Array.isArray(params.location) ? params.location[0] : params.location
  ) as Location | undefined;

  const submissions = await getLatestContestSubmissions({ category, location });

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: '#f5f5f5',
        flexGrow: 1,
        height: 'auto',
        overflow: 'auto',
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
                height: 340,
              }}
            >
              <Chart submissions={submissions} />
            </Paper>
          </Grid>
          {/* Overview */}
          <Grid item xs={12} sm={12} md={5} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 340,
              }}
            >
              <Overview
                submissions={submissions}
                category={category}
                location={location}
              />
            </Paper>
          </Grid>
          {/* Results */}
          <Grid item xs={12} sm={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Results submissions={submissions} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
