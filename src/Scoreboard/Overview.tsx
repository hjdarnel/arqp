import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { Submission } from '@prisma/client';
import toast from 'react-hot-toast';
import { getContest } from '../util/fetch-contest';
import { getAllResultsByContest } from '../util/fetch-all-results-by-contest';
import { useState } from 'react';
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
