import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip, 
  SelectChangeEvent,
  Grid,
  OutlinedInput,
  Stack
} from '@mui/material';
import { TrainingRecord } from '../types/TrainingData';

export interface FilterOptions {
  timeFrame: {
    startMonth: string | null;
    endMonth: string | null;
  };
  categories: string[];
}

interface DashboardFiltersProps {
  data: TrainingRecord[];
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({ 
  data, 
  filters, 
  onFilterChange 
}) => {
  // Extract available months from data
  const availableMonths = React.useMemo(() => {
    const months = new Set<string>();
    
    data.forEach(record => {
      if (record.enrollmentDate) {
        const date = new Date(record.enrollmentDate);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        months.add(monthYear);
      }
    });
    
    return Array.from(months).sort().map(monthYear => {
      const [year, month] = monthYear.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      return {
        value: monthYear,
        label: `${monthNames[date.getMonth()]} ${date.getFullYear()}`
      };
    });
  }, [data]);
  
  // Extract categories from data
  const availableCategories = React.useMemo(() => {
    const categories = new Set<string>();
    
    data.forEach(record => {
      let category = 'Other';
      if (record.course.toLowerCase().includes('webinar')) {
        // Count ALL webinars
        category = 'Webinar';
      } else if (record.course.toLowerCase().includes('recording')) {
        category = 'Recording';
      } else {
        category = 'eLearning';
      }
      categories.add(category);
    });
    
    return Array.from(categories);
  }, [data]);

  const handleTimeFrameChange = (event: SelectChangeEvent, type: 'startMonth' | 'endMonth') => {
    const value = event.target.value === 'all' ? null : event.target.value;
    onFilterChange({
      ...filters,
      timeFrame: {
        ...filters.timeFrame,
        [type]: value
      }
    });
  };

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onFilterChange({
      ...filters,
      categories: typeof value === 'string' ? value.split(',') : value
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Dashboard Filters
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>From Month</InputLabel>
            <Select
              value={filters.timeFrame.startMonth || 'all'}
              label="From Month"
              onChange={(e) => handleTimeFrameChange(e, 'startMonth')}
            >
              <MenuItem value="all">All Time</MenuItem>
              {availableMonths.map((month) => (
                <MenuItem key={`start-${month.value}`} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>To Month</InputLabel>
            <Select
              value={filters.timeFrame.endMonth || 'all'}
              label="To Month"
              onChange={(e) => handleTimeFrameChange(e, 'endMonth')}
              disabled={!filters.timeFrame.startMonth}
            >
              <MenuItem value="all">Latest</MenuItem>
              {availableMonths
                .filter(month => {
                  if (!filters.timeFrame.startMonth) return true;
                  return month.value >= filters.timeFrame.startMonth;
                })
                .map((month) => (
                  <MenuItem key={`end-${month.value}`} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Training Categories</InputLabel>
            <Select
              multiple
              value={filters.categories}
              onChange={handleCategoryChange}
              input={<OutlinedInput label="Training Categories" />}
              renderValue={(selected) => (
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {selected.length === 0 ? (
                    <Chip label="All Categories" />
                  ) : (
                    selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))
                  )}
                </Stack>
              )}
            >
              {availableCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      {(filters.timeFrame.startMonth || filters.categories.length > 0) && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" component="div">
            Active filters: 
            {filters.timeFrame.startMonth && (
              <Chip 
                label={`Time: ${availableMonths.find(m => m.value === filters.timeFrame.startMonth)?.label} to ${
                  filters.timeFrame.endMonth 
                    ? availableMonths.find(m => m.value === filters.timeFrame.endMonth)?.label 
                    : 'Latest'
                }`} 
                size="small" 
                sx={{ ml: 1 }} 
              />
            )}
            {filters.categories.map(cat => (
              <Chip key={cat} label={`Category: ${cat}`} size="small" sx={{ ml: 1 }} />
            ))}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}; 