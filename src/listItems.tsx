import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import PublishIcon from '@mui/icons-material/Publish';
import DownloadIcon from '@mui/icons-material/Download';
import { Link } from 'react-router-dom';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/">
      <ListItemIcon sx={{ minWidth: { xs: '26px', md: '65px' } }}>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText
        sx={{ display: { xs: 'none', md: 'block' } }}
        primary="Scoreboard"
      />
    </ListItemButton>
    <ListItemButton component={Link} to="/submit">
      <ListItemIcon sx={{ minWidth: { xs: '26px', md: '65px' } }}>
        <PublishIcon />
      </ListItemIcon>
      <ListItemText
        sx={{ display: { xs: 'none', md: 'block' } }}
        primary="Submit Log"
      />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
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
  </React.Fragment>
);
