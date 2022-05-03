import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from '../Scoreboard/Chart';
import Deposits from '../Scoreboard/Deposits';
import Orders from '../Scoreboard/Orders';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getContest } from '../util/fetch-contest';
import { getAllContests } from '../util/fetch-all-contests';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import { Contest } from '@prisma/client';
import { getResult } from '../util/fetch-result';

export default function Search() {
  const [allContests, setAllContests] = useState();
  const [selectedContest, setSelectedContest] = useState('');
  const [selectedCall, setSelectedCall] = useState('');
  const [results, setResults] = useState();

  useEffect(() => {
    getAllContests()
      .then((response) => setAllContests(response as any))
      .catch(() => {
        toast.error(
          'Error retrieving contests! Please contact arkansasqsoparty@gmail.com for help.',
          { duration: 6000 }
        );
      });
  }, []);

  const fetchResults = (contest: string, call: string) => {
    console.log(contest, call);
    if (!call || contest === '') return;
    getResult(contest, call).then((x) => setResults(x));
  };

  const contestChangeHandler = (event: any) => {
    setSelectedContest(event.target.value);
    fetchResults(event.target.value, selectedCall);
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
    if (e && e.target && e.target.value) {
      setSelectedCall(e.target.value);
      fetchResults(selectedContest, e.target.value);
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
          <Grid item xs={7}>
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

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 2
                }}
              >
                <form onSubmit={(e) => e.preventDefault()}>
                  <TextField
                    label="Callsign"
                    helperText="Call Sign Used During Contest"
                    onChange={handleUpdate}
                    name="callsign"
                  />
                </form>

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
              </Box>
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Orders />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
