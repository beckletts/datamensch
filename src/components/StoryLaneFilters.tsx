import React, { useMemo } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { StoryLaneRecord, StoryLaneFilterOptions } from '../types/StoryLaneData';
import { getAllDemoTypes } from '../utils/storylaneDataProcessor';

interface StoryLaneFiltersProps {
    data: StoryLaneRecord[];
    filters: StoryLaneFilterOptions;
    onFilterChange: (filters: StoryLaneFilterOptions) => void;
}

export const StoryLaneFilters: React.FC<StoryLaneFiltersProps> = ({
    data,
    filters,
    onFilterChange
}) => {
    // Extract unique months from data
    const months = useMemo(() => {
        const monthSet = new Set<string>();
        data.forEach(record => {
            try {
                // Format is "M/D/YY HH:MM" (e.g., "5/7/25 13:25")
                const dateParts = record.lastView.trim().split(' ')[0].split('/');
                if (dateParts.length === 3) {
                    // Convert YY to YYYY (assuming 20xx for simplicity)
                    const year = dateParts[2].length === 2 ? `20${dateParts[2]}` : dateParts[2];
                    // Month is in position 0
                    const monthNum = parseInt(dateParts[0], 10);
                    // Format as YYYY-MM
                    const month = `${year}-${String(monthNum).padStart(2, '0')}`;
                    monthSet.add(month);
                }
            } catch (e) {
                // Skip invalid dates
                console.error('Error parsing date:', record.lastView, e);
            }
        });
        return Array.from(monthSet).sort();
    }, [data]);

    // Get all unique demo types
    const demoTypes = useMemo(() => getAllDemoTypes(data), [data]);

    const handleMonthChange = (event: any) => {
        const month = event.target.value === 'all' ? null : event.target.value;
        onFilterChange({ ...filters, month });
    };

    const handleDemoTypeChange = (event: any) => {
        const demoType = event.target.value === 'all' ? null : event.target.value;
        onFilterChange({ ...filters, demoType });
    };

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>Month</InputLabel>
                        <Select
                            value={filters.month || 'all'}
                            onChange={handleMonthChange}
                            label="Month"
                        >
                            <MenuItem value="all">All Months</MenuItem>
                            {months.map(month => (
                                <MenuItem key={month} value={month}>
                                    {new Date(month + '-01').toLocaleDateString(undefined, { 
                                        year: 'numeric', 
                                        month: 'long' 
                                    })}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>Demo Type</InputLabel>
                        <Select
                            value={filters.demoType || 'all'}
                            onChange={handleDemoTypeChange}
                            label="Demo Type"
                        >
                            <MenuItem value="all">All Demos</MenuItem>
                            {demoTypes.map(demo => (
                                <MenuItem key={demo} value={demo}>
                                    {demo}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    );
}; 