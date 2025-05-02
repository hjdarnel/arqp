import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { Submission } from '@prisma/client';
import Title from './Title';

const columns: GridColDef[] = [
  { field: 'callsign', headerName: 'Callsign', width: 90 },
  {
    field: 'claimedScore',
    headerName: 'Score',
    width: 100,
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 250,
  },
  {
    field: 'logBand',
    headerName: 'Band',
    width: 110,
  },
  {
    field: 'logMode',
    headerName: 'Mode',
    width: 110,
  },
  {
    field: 'logStation',
    headerName: 'Station',
    width: 110,
  },
  {
    field: 'contestLocation',
    headerName: 'Location',
    width: 200,
  },
];

export default function Results({
  submissions,
}: {
  submissions: Submission[];
}) {
  return (
    <>
      <Title>Results</Title>
      <div style={{ height: '400px', width: '100%' }}>
        <DataGrid
          rows={submissions}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 },
            },
          }}
        />
      </div>
    </>
  );
}
