import * as React from 'react';
import { Submission } from '@prisma/client';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const createRows = (data: any) => {
  if (!data) return [];
  return [];
};

export default function Results({ data }: { data: Submission }) {
  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" sx={{ mb: 2 }}>
        Results
      </Typography>
      <Box>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Callsign</TableCell>
              <TableCell align="right">Claimed Score</TableCell>
              <TableCell align="right">Power</TableCell>
              <TableCell align="right">Band</TableCell>
              <TableCell align="right">Mode</TableCell>
              <TableCell align="right">Club</TableCell>
              <TableCell align="right">Location</TableCell>
              <TableCell align="right">Multiple Operators</TableCell>
              <TableCell align="right">Station</TableCell>
              <TableCell align="right">Transmitter</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="right">{data.callsign}</TableCell>
              <TableCell align="right">{data.claimedScore}</TableCell>
              <TableCell align="right">{data.power}W</TableCell>
              <TableCell align="right">{data.logBand}</TableCell>
              <TableCell align="right">{data.logMode}</TableCell>
              <TableCell align="right">{data.club}</TableCell>
              <TableCell align="right">{data.location}</TableCell>
              <TableCell align="right">
                {data.multipleOperators ? 'Yes' : 'No'}
              </TableCell>
              <TableCell align="right">{data.logStation}</TableCell>
              <TableCell align="right">{data.logTransmitter}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </React.Fragment>
  );
}
