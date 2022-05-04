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
  Typography,
  Button
} from '@mui/material';
import { Contest } from '@prisma/client';
import useAnalyticsEventTracker from '../util/analytics';

export default function Export() {
  const [allContests, setAllContests] = useState<Contest[]>();
  const [selectedContest, setSelectedContest] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const gaEventTracker = useAnalyticsEventTracker();

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

  const fetchResults = (e: any) => {
    e.preventDefault();
    gaEventTracker('export', 'export_results');
    location.assign(
      '/api/export-contest?' +
        new URLSearchParams({
          contestId: selectedContest
        })
    );
  };

  useEffect(() => {
    getAllContests()
      .then((response) => {
        setAllContests(response);
        setSelectedContest(response[0].id);
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          `Error retrieving contests! Please contact arkansasqsoparty@gmail.com for help. ${err}`,
          { duration: 6000 }
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  const contestChangeHandler = (event: any) => {
    setSelectedContest(event.target.value);
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
          <Grid item xs={8}>
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

              <form onSubmit={fetchResults}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2
                  }}
                >
                  <FormControl sx={{ width: '300px' }}>
                    <InputLabel id="contest-select-label">
                      Select Contest
                    </InputLabel>
                    <Select
                      labelId="contest-select-label"
                      id="contest-select"
                      value={selectedContest}
                      label="Select Contest"
                      onChange={contestChangeHandler}
                    >
                      {mapContests()}
                    </Select>
                  </FormControl>
                  <Button
                    sx={{ height: '56px' }}
                    onClick={fetchResults}
                    variant="contained"
                    color="success"
                    disabled={isLoading}
                  >
                    Export
                  </Button>
                </Box>
              </form>
              <Typography
                variant="body2"
                color="text.secondary"
                align="left"
                sx={{ mt: 2 }}
              >
                Select a contest to export the entire result set as a CSV.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
