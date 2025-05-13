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
  Stack,
  TextField
} from '@mui/material';
import { TrainingRecord } from '../types/TrainingData';

export interface FilterOptions {
  timeFrame: {
    startMonth: string | null;
    endMonth: string | null;
  };
  categories: string[];
  country: 'all' | 'uk' | 'international';
  eLearningCourse: string | null;
  qualificationType: 'all' | 'vq' | 'gq';
  centres: string[];
  courses: string[];
  startDate: string;
  endDate: string;
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

  // Extract eLearning courses
  const eLearningCourses = React.useMemo(() => {
    const courses = new Set<string>();
    
    data.forEach(record => {
      // Only include eLearning courses (not webinars or recordings)
      if (!record.course.toLowerCase().includes('webinar') && 
          !record.course.toLowerCase().includes('recording')) {
        courses.add(record.course);
      }
    });
    
    return Array.from(courses).sort();
  }, [data]);

  // Get unique values for filters
  const uniqueCategories = [...new Set(data.map(record => record.category))];
  const uniqueCentres = [...new Set(data.map(record => record.centre))].filter(Boolean);
  const uniqueCourses = [...new Set(data.map(record => record.course))];

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
    const value = event.target.value as string[];
    onFilterChange({
      ...filters,
      categories: value
    });
  };

  const handleCountryChange = (event: SelectChangeEvent) => {
    onFilterChange({
      ...filters,
      country: event.target.value as 'all' | 'uk' | 'international'
    });
  };

  const handleQualificationTypeChange = (event: SelectChangeEvent) => {
    onFilterChange({
      ...filters,
      qualificationType: event.target.value as 'all' | 'vq' | 'gq'
    });
  };

  const handleELearningCourseChange = (event: SelectChangeEvent) => {
    const value = event.target.value === 'all' ? null : event.target.value;
    onFilterChange({
      ...filters,
      eLearningCourse: value
    });
  };

  const handleCentreChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    onFilterChange({
      ...filters,
      centres: value
    });
  };

  const handleCourseChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    onFilterChange({
      ...filters,
      courses: value
    });
  };

  const handleDateRangeChange = (field: 'startDate' | 'endDate') => (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      [field]: event.target.value
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Dashboard Filters
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
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
        
        <Grid item xs={12} md={6} lg={3}>
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
        
        <Grid item xs={12} md={6} lg={3}>
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
              {uniqueCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <FormControl fullWidth>
            <InputLabel>Location</InputLabel>
            <Select
              value={filters.country}
              label="Location"
              onChange={handleCountryChange}
            >
              <MenuItem value="all">All Locations</MenuItem>
              <MenuItem value="uk">UK Only</MenuItem>
              <MenuItem value="international">International Only</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <FormControl fullWidth>
            <InputLabel>Qualification Type</InputLabel>
            <Select
              value={filters.qualificationType}
              label="Qualification Type"
              onChange={handleQualificationTypeChange}
            >
              <MenuItem value="all">All Qualifications</MenuItem>
              <MenuItem value="vq">Vocational (VQ)</MenuItem>
              <MenuItem value="gq">General (GQ)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <FormControl fullWidth>
            <InputLabel>eLearning Course</InputLabel>
            <Select
              value={filters.eLearningCourse || 'all'}
              label="eLearning Course"
              onChange={handleELearningCourseChange}
              disabled={filters.categories.length > 0 && !filters.categories.includes('eLearning')}
            >
              <MenuItem value="all">All eLearning Courses</MenuItem>
              {eLearningCourses.map((course) => (
                <MenuItem key={course} value={course}>
                  {course}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <FormControl fullWidth>
            <InputLabel>Centres</InputLabel>
            <Select
              multiple
              value={filters.centres}
              onChange={handleCentreChange}
              input={<OutlinedInput label="Centres" />}
              renderValue={(selected) => (
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Stack>
              )}
            >
              {uniqueCentres.map((centre) => (
                <MenuItem key={centre} value={centre}>
                  {centre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <FormControl fullWidth>
            <InputLabel>Courses</InputLabel>
            <Select
              multiple
              value={filters.courses}
              onChange={handleCourseChange}
              input={<OutlinedInput label="Courses" />}
              renderValue={(selected) => (
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Stack>
              )}
            >
              {uniqueCourses.map((course) => (
                <MenuItem key={course} value={course}>
                  {course}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <TextField
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={handleDateRangeChange('startDate')}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <TextField
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={handleDateRangeChange('endDate')}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
        </Grid>
      </Grid>
      
      {(filters.timeFrame.startMonth || filters.categories.length > 0 || 
        filters.country !== 'all' || filters.eLearningCourse) && (
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
            {filters.country !== 'all' && (
              <Chip 
                label={`Location: ${filters.country === 'uk' ? 'UK Only' : 'International Only'}`} 
                size="small" 
                sx={{ ml: 1 }} 
              />
            )}
            {filters.eLearningCourse && (
              <Chip 
                label={`eLearning: ${filters.eLearningCourse}`} 
                size="small" 
                sx={{ ml: 1 }} 
              />
            )}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}; 