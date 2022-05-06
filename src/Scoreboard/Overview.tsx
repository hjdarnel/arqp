import Typography from '@mui/material/Typography';
import Title from './Title';
import { Submission } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { Category } from '../util/categories';

import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

export default function Overview({
  allSubmissions
}: {
  allSubmissions: Submission[];
}) {
  const [category, setCategory] = useState<'All Categories' | Category>(
    'All Categories'
  );
  const [submissions, setSubmissions] = useState<Submission[]>(allSubmissions);

  useEffect(() => {
    setSubmissions(
      allSubmissions?.filter((x) => {
        if (!category || category === 'All Categories') return true;
        return x.category === category;
      })
    );
  }, [allSubmissions, category]);

  const onCategoryChange = (e: any) => {
    const { value } = e.target;
    setCategory(value);
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <Title>Overview</Title>
        <FormControl>
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
      </Box>
      <Typography component="p" variant="h4">
        {submissions.length}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        Total Submissions
      </Typography>
      <Typography component="p" variant="h4">
        {submissions.reduce((acc, current) => {
          return current.claimedScore > acc ? current.claimedScore : acc;
        }, 0)}
      </Typography>
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
