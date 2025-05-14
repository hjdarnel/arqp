import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllContests } from '../util/get-all-contests';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Button
} from '@mui/material';
import { Contest, Submission } from '@prisma/client';
import { getResult } from '../util/get-result-by-call';
import Results from './Results';
import useAnalyticsEventTracker from '../util/analytics';

export default function Search() {
  const [allContests, setAllContests] = useState<Contest[]>();
  const [selectedContest, setSelectedContest] = useState<string>('');
  const [selectedCall, setSelectedCall] = useState<string>('');
  const [results, setResults] = useState<Submission[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const gaEventTracker = useAnalyticsEventTracker();

  useEffect(() => {
    const ac = new AbortController();

    getAllContests(ac)
      .then((response) => {
        if (ac.signal.aborted) return;
        setAllContests(response);
        setSelectedContest(response[0].id);
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          `Error retrieving contests! Please contact arkansasqsoparty@gmail.com for help. \n\n${err}`,
          { duration: 6000 }
        );
      })
      .finally(() => setIsLoading(false));

    return () => {
      setAllContests([]);
      setSelectedContest('');
      ac.abort();
    };
  }, []);

  const fetchResults = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    gaEventTracker('search results', 'search_results');

    if (!selectedCall || selectedContest === '') return setIsLoading(false);

    const ac = new AbortController();
    getResult(ac, selectedContest, selectedCall)
      .then((x) => {
        if (ac.signal.aborted) return;

        setResults(x);
      })
      .catch((err) => {
        console.error(err);

        toast.error(
          `Error retrieving contests! Please contact arkansasqsoparty@gmail.com for help. \n\n${err}`,
          { duration: 6000 }
        );
      })
      .finally(() => setIsLoading(false));
    return () => {
      setResults(undefined);
      ac.abort();
    };
  };

  const contestChangeHandler = (event: any) => {
    setSelectedContest(event.target.value);
  };

  const mapContests = () => {
    if (allContests)
      return (allContests as Contest[]).map((x) => {
        return (
          <MenuItem key={x.id} value={x.id}>
            {x.title}
          </MenuItem>
        );
      });
  };

  const handleUpdate = (e: any) => {
    e.preventDefault();
    if (e && e.target) {
      setSelectedCall(e.target.value.toUpperCase());
    }
  };

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
          <Grid item xs={12} md={8}>
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
              <form onSubmit={fetchResults}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2
                  }}
                >
                  <TextField
                    label="Callsign"
                    helperText="Call Sign Used During Contest"
                    onChange={handleUpdate}
                    value={selectedCall}
                    name="callsign"
                  />

                  <FormControl>
                    <InputLabel id="contest-select-label">
                      Select Contest
                    </InputLabel>
                    <Select
                      labelId="contest-select-label"
                      id="contest-select"
                      value={selectedContest}
                      label="Select Contest"
                      onChange={contestChangeHandler}
                      MenuProps={{ transitionDuration: 0 }}
                      sx={{ minWidth: '100px' }}
                    >
                      {mapContests()}
                    </Select>
                  </FormControl>

                  <Button
                    sx={{ height: '56px' }}
                    type="submit"
                    variant="contained"
                    color="success"
                    disabled={isLoading}
                  >
                    Submit
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>

          {/* Results */}
          {results && (
            <Grid item sm={12}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Results submissions={results} />
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}
