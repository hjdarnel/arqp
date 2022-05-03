import Typography from '@mui/material/Typography';
import Title from './Title';
import { Submission } from '@prisma/client';
import React from 'react';

export default function Overview({
  submissions
}: {
  submissions: Submission[];
}) {
  return (
    <React.Fragment>
      <Title>Overview</Title>
      <Typography component="p" variant="h4">
        {submissions?.length}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        Total Submissions
      </Typography>
      <Typography component="p" variant="h4">
        {submissions.reduce((acc, current) => acc + current.claimedScore, 0)}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        Total Score
      </Typography>
    </React.Fragment>
  );
}
