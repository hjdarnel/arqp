import * as React from 'react';
import Title from './Title';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Submission } from '@prisma/client';

const columns: GridColDef[] = [
  { field: 'callsign', headerName: 'Callsign', width: 90 },
  {
    field: 'claimedScore',
    headerName: 'Score',
    width: 150
  },
  {
    field: 'power',
    headerName: 'Power',
    width: 150
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
    field: 'logTransmitter',
    headerName: 'Transmitter',
    width: 110
  },
  {
    field: 'logOperator',
    headerName: 'Operators',
    width: 110,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.logOperator === 'CHECKLOG'
        ? 'CHECKLOG'
        : `${params.row.logOperator}-OP`
  }
];

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function Results({
  submissions
}: {
  submissions: Submission[];
}) {
  return (
    <React.Fragment>
      <Title>Results</Title>
      <div style={{ height: '400px', width: '100%' }}>
        <DataGrid
          rows={submissions}
          columns={columns}
          pageSize={25}
          disableSelectionOnClick
        />
      </div>
    </React.Fragment>
  );
}
