'use client';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { Category } from '~/util/categories';
import { Location } from '~/util/locations';

export const Filter = (params: {
  category: string | undefined;
  location: string | undefined;
}) => {
  const defaultCategory = params.category
    ? (Category[params.category as Category] ?? 'All Categories')
    : 'All Categories';
  const defaultLocation = params.location
    ? (Location[params.location as Location] ?? 'All Locations')
    : 'All Locations';

  const [category, setCategory] = useState<'All Categories' | Category>(
    defaultCategory,
  );
  const [location, setLocation] = useState<'All Locations' | Location>(
    defaultLocation,
  );

  const buildSearchParams = (
    category: 'All Categories' | Category,
    location: 'All Locations' | Location,
  ) => {
    if (category === 'All Categories' && location === 'All Locations') {
      return '/';
    }
    if (category === 'All Categories') {
      return `?location=${location}`;
    }
    if (location === 'All Locations') {
      return `?category=${category}`;
    }
    return `?category=${category}&location=${location}`;
  };

  const onFilterChange = (
    e: SelectChangeEvent,
    type: 'category' | 'location',
  ) => {
    const value = e.target.value;
    if (type === 'category') {
      setCategory(value as Category);
      redirect(buildSearchParams(value as Category, location));
    } else {
      setLocation(value as Location);
      redirect(buildSearchParams(category, value as Location));
    }
  };
  return (
    <Box
      sx={{
        flex: 1,
      }}
    >
      <FormControl sx={{ marginRight: 2, marginBottom: 2 }}>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          sx={{ width: 160 }}
          id="category-select"
          labelId="category-select-label"
          name="category"
          value={category}
          label="Category"
          onChange={(e) => onFilterChange(e, 'category')}
          MenuProps={{ transitionDuration: 0 }}
        >
          <MenuItem key={'all'} value={'All Categories'}>
            {'All Categories'}
          </MenuItem>
          {Object.keys(Category).map((x) => {
            return (
              <MenuItem key={x} value={x}>
                {x}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl sx={{ marginBottom: 2 }}>
        <InputLabel id="location-select-label">Location</InputLabel>
        <Select
          sx={{ width: 160 }}
          id="location-select"
          labelId="location-select-label"
          name="location"
          value={location}
          label="Location"
          onChange={(e) => onFilterChange(e, 'location')}
          MenuProps={{ transitionDuration: 0 }}
        >
          <MenuItem key={'all'} value={'All Locations'}>
            {'All Locations'}
          </MenuItem>
          {Object.keys(Location).map((x) => {
            return (
              <MenuItem key={x} value={x}>
                {x}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};
