import * as React from 'react';
import Title from './Title';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Submission } from '@prisma/client';

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
  submissions,
  isLoading
}: {
  submissions: Submission[];
  isLoading: boolean;
}) {
  return (
    <>
      <Title>Results</Title>
      <div style={{ height: '400px', width: '100%' }}>
        <DataGrid
          loading={isLoading}
          rows={submissions}
          columns={columns}
          pageSize={25}
          disableSelectionOnClick
        />
      </div>
    </>
  );
}
