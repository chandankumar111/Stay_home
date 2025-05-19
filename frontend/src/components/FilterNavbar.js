import React, { useState, useEffect } from 'react';
import { Box, TextField, Slider, Select, MenuItem, Button, InputLabel, FormControl } from '@mui/material';

const FilterNavbar = ({ filters, onFilterChange, onSearchClick, onClearClick }) => {
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(10000); // max price default
  const [type, setType] = useState('');

  // Sync internal state with filters prop only if different and location input is empty or unchanged
  useEffect(() => {
    if (filters) {
      if (filters.location && filters.location !== location) {
        setLocation(filters.location);
      }
      if (filters.priceRange && filters.priceRange[1] !== price) {
        setPrice(filters.priceRange[1]);
      }
      if (filters.propertyType && filters.propertyType !== type) {
        setType(filters.propertyType);
      }
    }
  }, [filters]);

  const handleSearchClick = () => {
    const filterValues = {
      location: location.trim(),
      priceRange: [0, price],
      propertyType: type
    };
    onSearchClick(filterValues);
  };

  const handleClearClick = () => {
    setLocation('');
    setPrice(10000);
    setType('');
    if (onClearClick) {
      onClearClick();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        p: 1,
        backgroundColor: '#f0f0f0',
        mb: 4,
        width: '100%',
        boxSizing: 'border-box',
        flexWrap: 'wrap',
      }}
    >
      <TextField
        label="Location"
        variant="outlined"
        size="small"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter location"
        sx={{ minWidth: 150, flexGrow: 1 }}
      />
      <Box sx={{ width: 200 }}>
        <InputLabel shrink htmlFor="price-slider" sx={{ mb: 1 }}>
          Max Price: ₹{price}
        </InputLabel>
        <Slider
          id="price-slider"
          min={0}
          max={10000}
          step={500}
          value={price}
          onChange={(e, newValue) => setPrice(newValue)}
          valueLabelDisplay="auto"
          aria-labelledby="price-slider"
        />
      </Box>
      <FormControl sx={{ minWidth: 120 }} size="small">
        <InputLabel id="type-select-label">Type</InputLabel>
        <Select
          labelId="type-select-label"
          value={type}
          label="Type"
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="pg">PG</MenuItem>
          <MenuItem value="flat">Flat</MenuItem>
          <MenuItem value="room">Room</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSearchClick}>
          Search
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClearClick}>
          Clear
        </Button>
      </Box>
    </Box>
  );
};

export default FilterNavbar;
