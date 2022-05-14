import * as React from 'react';
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Bar,
  BarChart,
  Tooltip
} from 'recharts';
import Title from './Title';
import { Submission } from '@prisma/client';

export default function Chart({ submissions }: { submissions: Submission[] }) {
  return (
    <React.Fragment>
      <Title>Scores</Title>
      <ResponsiveContainer>
        <BarChart width={730} height={250} data={submissions} maxBarSize={40}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="claimedScore"
            type="number"
            domain={[0, (dataMax: any) => Math.ceil(dataMax / 100) * 100]}
            interval="preserveStartEnd"
            tickCount={12}
          />
          <Tooltip />
          <YAxis dataKey="claimedScore" type="number" hide />
          <Bar dataKey="claimedScore" name="Score" fill="#448AFF" />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
