import { Container, Grid2, Paper } from '@mui/material';
import { getLatestContestSubmissions } from '~/server/submissions';
import type { Category } from '~/util/categories';
import type { Location } from '~/util/locations';
import Results from '../shared/Results';
import Chart from './Chart';
import Overview from './Overview';

export default async function Scoreboard({
  searchParams
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
    <>
      <Container maxWidth="lg">
        <Grid2 container spacing={3}>
          {/* Chart */}
          <Grid2 size={{ xs: 12, sm: 12, md: 7, lg: 8 }}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 340
              }}
            >
              <Chart submissions={submissions} />
            </Paper>
          </Grid2>
          {/* Overview */}
          <Grid2 size={{ xs: 12, sm: 12, md: 5, lg: 4 }}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Overview
                submissions={submissions}
                category={category}
                location={location}
              />
            </Paper>
          </Grid2>
          {/* Results */}
          <Grid2 size={{ xs: 12, sm: 12 }}>
            <Paper sx={{ p: 2 }}>
              <Results
                submissions={submissions}
                maxHeight="calc(100vh - 550px)"
              />
            </Paper>
          </Grid2>
        </Grid2>
      </Container>
    </>
  );
}
