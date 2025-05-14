import * as React from 'react';
import { Submission } from '@prisma/client';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { Typography } from '@mui/material';

const columns: GridColDef[] = [
  { field: 'callsign', headerName: 'Callsign', width: 90 },
  {
    field: 'claimedScore',
    headerName: 'Score',
    width: 100
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 250
  },
  {
    field: 'logBand',
    headerName: 'Band',
    width: 110
  },
  {
    field: 'logMode',
    headerName: 'Mode',
    width: 110
  },
  {
    field: 'logStation',
    headerName: 'Station',
    width: 110
  },
  {
    field: 'contestLocation',
    headerName: 'Location',
    width: 200
  }
];

export default function Results({
  submissions
}: {
  submissions: Submission[];
}) {
  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Results
      </Typography>
      <div style={{ height: '400px', width: '100%' }}>
        <DataGrid
          rows={submissions}
          columns={columns}
          pageSize={25}
          disableSelectionOnClick
        />
      </div>
    </>
  );
}
