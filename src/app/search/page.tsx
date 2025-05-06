import { Grid2, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import type { Submission } from '@prisma/client';
import { getAllContests } from '~/server/contests';
import { getSubmission } from '~/server/submissions';
import Results from '../shared/Results';
import { SearchForm } from './SearchForm';

export default async function Search({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const callsign = Array.isArray(params.callsign)
    ? params.callsign[0]
    : params.callsign;
  const contestId = Array.isArray(params.contestId)
    ? params.contestId[0]
    : params.contestId;

  const results: Submission[] = [];

  if (callsign && contestId) {
    const submissions = await getSubmission(contestId, callsign);
    if (submissions) {
      results.push(...submissions);
    }
  }

  const contests = await getAllContests();

  return (
    <Box component="main">
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
                Search Results
              </Typography>
              <SearchForm
                contests={contests}
                callsign={callsign}
                contestId={contestId ?? contests[0]?.id ?? ''}
              />
            </Paper>
          </Grid2>

          {/* Results */}
          {results && (
            <Grid2 size={{ sm: 12 }}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Results
                  submissions={results}
                  maxHeight="calc(100vh - 400px)"
                />
              </Paper>
            </Grid2>
          )}
        </Grid2>
      </Container>
    </Box>
  );
}
