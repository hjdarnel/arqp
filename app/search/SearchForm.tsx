'use client';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import type { Contest } from '@prisma/client';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import useAnalyticsEventTracker from '~/util/analytics';

export const SearchForm = ({
  contests,
  callsign,
  contestId,
}: {
  contests: Contest[];
  callsign: string | undefined;
  contestId: string | undefined;
}) => {
  const gaEventTracker = useAnalyticsEventTracker();
  const [callsignValue, setCallsignValue] = useState<string>(callsign ?? '');
  const [contestIdValue, setContestIdValue] = useState<string>(contestId ?? '');

  const mapContests = () =>
    contests.map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {x.title}
      </MenuItem>
    ));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        gaEventTracker('search results', 'search_results');

        if (callsignValue && contestIdValue) {
          redirect(
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            `/search?callsign=${callsignValue.toString()}&contestId=${contestIdValue.toString()}`,
          );
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
        }}
      >
        <TextField
          label="Callsign"
          helperText="Call Sign Used During Contest"
          name="callsign"
          value={callsignValue}
          onChange={(e) => setCallsignValue(e.target.value)}
          required
        />

        <FormControl required>
          <InputLabel id="contest-select-label">Select Contest</InputLabel>
          <Select
            labelId="contest-select-label"
            id="contest-select"
            label="Select Contest"
            name="contestId"
            value={contestIdValue}
            onChange={(e) => setContestIdValue(e.target.value)}
            MenuProps={{ transitionDuration: 0 }}
            sx={{ minWidth: '200px' }}
          >
            {mapContests()}
          </Select>
        </FormControl>

        <Button
          sx={{ height: '56px' }}
          type="submit"
          variant="contained"
          color="success"
        >
          Submit
        </Button>
      </Box>
    </form>
  );
};
