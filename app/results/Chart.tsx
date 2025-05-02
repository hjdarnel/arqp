'use client';
import type { Submission } from '@prisma/client';
import {
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis
} from 'recharts';
import Title from '../shared/Title';
import CustomTooltipContent from './CustomTooltip';

const formatSubmissions = (
  submissions: Submission[]
): { claimedScore: number; jitter: number; callsign: string }[] =>
  submissions.map((submission) => ({
    claimedScore: submission.claimedScore,
    jitter: Math.random() * 2 + 1,
    callsign: submission.callsign
  }));

const calculateTicks = (submissions: Submission[]): number[] => {
  const ticks: number[] = [];

  const max = submissions.reduce((score: number, current) => {
    return current.claimedScore > score ? current.claimedScore : score;
  }, 0);

  if (max < 2000) {
    ticks.push(0, 1000, 2000);
    return ticks;
  }

  for (let i = 0; i * 2 <= Math.ceil(max / 1000); i++) {
    ticks.push(i * 2000);
  }

  return ticks;
};

export default function Chart({ submissions }: { submissions: Submission[] }) {
  return (
    <>
      <Title>Scores</Title>
      <ResponsiveContainer>
        <ScatterChart width={730} height={250}>
          <XAxis
            dataKey="claimedScore"
            name="Score"
            type="number"
            domain={[0, (dataMax: number) => Math.ceil(dataMax / 100) * 100]}
            ticks={calculateTicks(submissions)}
            minTickGap={0}
          />
          <Tooltip content={<CustomTooltipContent ignore={['jitter']} />} />
          <YAxis
            dataKey="jitter"
            name="jitter"
            type="number"
            domain={[0, (dataMax: number) => dataMax + 1]}
            hide
          />
          <ZAxis dataKey="callsign" name="Callsign" type="category" />
          <Scatter data={formatSubmissions(submissions)} fill="#448AFF" />
        </ScatterChart>
      </ResponsiveContainer>
    </>
  );
}
