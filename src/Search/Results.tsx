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

export default function Results({ data }: { data: Submission[] }) {
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
              <TableCell align="right">Band</TableCell>
              <TableCell align="right">Mode</TableCell>
              <TableCell align="right">Club</TableCell>
              <TableCell align="right">Multiple Operators</TableCell>
              <TableCell align="right">Station</TableCell>
              <TableCell align="right">Transmitter</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((x) => (
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="right">{x.callsign}</TableCell>
                <TableCell align="right">{x.claimedScore}</TableCell>
                <TableCell align="right">{x.logBand}</TableCell>
                <TableCell align="right">{x.logMode}</TableCell>
                <TableCell align="right">{x.club}</TableCell>
                <TableCell align="right">
                  {x.multipleOperators ? 'Yes' : 'No'}
                </TableCell>
                <TableCell align="right">{x.logStation}</TableCell>
                <TableCell align="right">{x.logTransmitter}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </React.Fragment>
  );
}
