import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import { Link } from 'react-router-dom';
import { CloudUpload } from '@mui/icons-material';

export const mainListItems = ({
  excludeSubmitLog
}: {
  excludeSubmitLog: boolean;
}) => (
  <>
    <ListItemButton component={Link} to="/">
      <ListItemIcon sx={{ minWidth: { xs: '26px', md: '65px' } }}>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText
        sx={{ display: { xs: 'none', md: 'block' } }}
        primary="Latest Scoreboard"
      />
    </ListItemButton>
    {!excludeSubmitLog && (
      <ListItemButton component={Link} to="/submit">
        <ListItemIcon sx={{ minWidth: { xs: '26px', md: '65px' } }}>
          <CloudUpload />
        </ListItemIcon>
        <ListItemText
          sx={{ display: { xs: 'none', md: 'block' } }}
          primary="Submit Log"
        />
      </ListItemButton>
    )}
  </>
);

export const secondaryListItems = (
  <>
    <ListItemButton component={Link} to="/search">
      <ListItemIcon sx={{ minWidth: { xs: '26px', md: '65px' } }}>
        <SearchIcon />
      </ListItemIcon>
      <ListItemText
        sx={{ display: { xs: 'none', md: 'block' } }}
        primary="Search by Call"
      />
    </ListItemButton>
    <ListItemButton component={Link} to="/export">
      <ListItemIcon sx={{ minWidth: { xs: '26px', md: '65px' } }}>
        <DownloadIcon />
      </ListItemIcon>
      <ListItemText
        sx={{ display: { xs: 'none', md: 'block' } }}
        primary="Export All Results"
      />
    </ListItemButton>
  </>
);
