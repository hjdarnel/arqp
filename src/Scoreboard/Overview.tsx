import Typography from '@mui/material/Typography';
import Title from './Title';
import { Submission } from '@prisma/client';
import React, { useState } from 'react';
import { Category } from '../util/categories';
import { Location } from '../util/locations';

import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { ResultsFilter } from './Scoreboard';

export default function Overview({
  submissions,
  updateFilteredResults
}: {
  submissions: Submission[];
  updateFilteredResults: ({ category, location }: ResultsFilter) => void;
}) {
  const [category, setCategory] = useState<'All Categories' | Category>(
    'All Categories'
  );
  const [location, setLocation] = useState<'All Locations' | Location>(
    'All Locations'
  );

  const onCategoryChange = (e: any) => {
    const { value } = e.target;
    setCategory(value);
    updateFilteredResults({ category: value, location });
  };

  const onLocationChange = (e: any) => {
    const { value } = e.target;
    setLocation(value);
    updateFilteredResults({ category, location: value });
  };

  const renderHighscore = (submissions: Submission[]) => {
    const highScore = submissions.reduce(
      (acc: { claimedScore: number; callsign: string }, current) => {
        return current.claimedScore > acc.claimedScore
          ? {
              claimedScore: current.claimedScore,
              callsign: current.callsign
            }
          : acc;
      },
      { claimedScore: 0, callsign: '' }
    );

    return (
      <React.Fragment>
        <Typography component="p" variant="h4" sx={{ display: 'inline' }}>
          {highScore.claimedScore}
        </Typography>
        {highScore.callsign && (
          <Typography
            component="p"
            variant="h4"
            sx={{ mx: 1, display: 'inline', fontWeight: 200 }}
          >
            &ndash;
          </Typography>
        )}
        <Typography component="p" variant="h4" sx={{ display: 'inline' }}>
          {highScore.callsign}
        </Typography>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <Title>Overview</Title>
      <Box
        sx={{
          flex: 1
        }}
      >
        <FormControl sx={{ marginRight: 2, marginBottom: 2 }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            sx={{ width: 160 }}
            id="category-select"
            labelId="category-select-label"
            name="category"
            value={category}
            label="Category"
            onChange={onCategoryChange}
            MenuProps={{ transitionDuration: 0 }}
          >
            <MenuItem key={'all'} value={'All Categories'}>
              {'All Categories'}
            </MenuItem>
            {Object.keys(Category).map((x) => {
              return (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl sx={{ marginBottom: 2 }}>
          <InputLabel id="location-select-label">Location</InputLabel>
          <Select
            sx={{ width: 160 }}
            id="location-select"
            labelId="location-select-label"
            name="location"
            value={location}
            label="Location"
            onChange={onLocationChange}
            MenuProps={{ transitionDuration: 0 }}
          >
            <MenuItem key={'all'} value={'All Locations'}>
              {'All Locations'}
            </MenuItem>
            {Object.keys(Location).map((x) => {
              return (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      <Typography component="p" variant="h4">
        {submissions.length}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        Total Submissions
      </Typography>
      <Box>{renderHighscore(submissions)}</Box>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        High Score
      </Typography>
      <Typography component="p" variant="h4">
        {submissions.length
          ? Math.round(
              submissions.reduce((a, b) => a + b.claimedScore, 0) /
                submissions.length
            )
          : 0}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        Average Score
      </Typography>
    </React.Fragment>
  );
}
