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
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Scoreboard" />
    </ListItemButton>
    <ListItemButton component={Link} to="/submit">
      <ListItemIcon>
        <PublishIcon />
      </ListItemIcon>
      <ListItemText primary="Submit Log" />
    </ListItemButton>
    
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/search">
      <ListItemIcon>
        <SearchIcon />
      </ListItemIcon>
      <ListItemText primary="Search by Call" />
    </ListItemButton>
    <ListItemButton component={Link} to="/export">
      <ListItemIcon>
        <DownloadIcon />
      </ListItemIcon>
        <ListItemText primary="Export All Results" />
    </ListItemButton>
  </React.Fragment>
);
