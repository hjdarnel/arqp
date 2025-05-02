'use client';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import type { Contest } from '@prisma/client';
import { type FormEvent, useState } from 'react';
import useAnalyticsEventTracker from '~/util/analytics';

export default function ExportForm({ contests }: { contests: Contest[] }) {
  const [selectedContest, setSelectedContest] = useState<string>(
    contests[0] ? contests[0].id : '',
  );
  const [password, setPassword] = useState<string>('');
  const gaEventTracker = useAnalyticsEventTracker();

  const mapContests = () => {
    if (contests)
      return contests.map((x) => {
        return (
          <MenuItem key={x.id} value={x.id}>
            {x.title}
          </MenuItem>
        );
      });
  };

  const contestChangeHandler = (event: SelectChangeEvent) => {
    setSelectedContest(event.target.value);
  };

  const fetchResults = (e: FormEvent) => {
    e.preventDefault();
    gaEventTracker('export all results');
    location.assign(
      `/api/export-contest?${new URLSearchParams({
        contestId: selectedContest,
        password,
      })}`,
    );
  };

  return (
    <form onSubmit={fetchResults}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
        }}
      >
        <FormControl>
          <InputLabel id="contest-select-label">Select Contest</InputLabel>
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
        <FormControl>
          <TextField
            required
            label="Password"
            helperText=""
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button
          sx={{ height: '56px' }}
          variant="contained"
          color="success"
          type="submit"
        >
          Export
        </Button>
      </Box>
    </form>
  );
}
