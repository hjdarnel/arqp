import Typography from '@mui/material/Typography';
import type { Submission } from '@prisma/client';
import Title from '../shared/Title';

import { Filter } from './Filter';

export default function Overview({
  submissions,
  category,
  location
}: {
  submissions: Submission[];
  category: string | undefined;
  location: string | undefined;
}) {
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
      <>
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
      </>
    );
  };

  return (
    <>
      <Filter category={category} location={location} />
      <Title>Overview</Title>
      <Typography component="p" variant="h4">
        {submissions.length}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        Total Submissions
      </Typography>
      <span>{renderHighscore(submissions)}</span>
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
    </>
  );
}
