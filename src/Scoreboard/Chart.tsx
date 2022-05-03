import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  CartesianGrid,
  Bar,
  BarChart,
  Legend,
  Tooltip
} from 'recharts';
import Title from './Title';
import { Submission } from '@prisma/client';
import { useEffect, useState } from 'react';

export default function Chart({ submissions }: { submissions: Submission[] }) {
  const [data, setData] = useState([] as any);

  useEffect(() => {
    const temp: any[] = [];

    submissions.map((x) => {
      const index = temp.findIndex((e) => e.claimedScore === x.claimedScore);
      if (index < 0) temp.push({ count: 1, claimedScore: x.claimedScore });
      else {
        temp[index] = {
          count: temp[index].count + 1,
          claimedScore: x.claimedScore
        };
      }
    });

    temp.sort((a, b) => a.claimedScore - b.claimedScore);
    setData(temp);
  }, [submissions]);

  return (
    <React.Fragment>
      <Title>Scores</Title>
      <ResponsiveContainer>
        <BarChart width={730} height={250} data={data} maxBarSize={40}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="claimedScore"
            type="number"
            domain={[0, (dataMax: any) => Math.ceil(dataMax / 100) * 100]}
            interval="preserveStartEnd"
            tickCount={12}
          />
          <Tooltip />
          <YAxis dataKey="count" type="number" hide />
          <Bar dataKey="count" name="Count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
