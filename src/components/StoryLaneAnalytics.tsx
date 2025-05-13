import React, { useMemo, useState } from 'react';
import { StoryLaneRecord } from '../types/StoryLaneData';
import { SearchBar } from './SearchBar';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    TableSortLabel,
    Paper, 
    Grid, 
    Card, 
    CardContent, 
    Typography, 
    Divider,
    Chip,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    SelectChangeEvent,
    Stack,
    InputAdornment,
    IconButton
} from '@mui/material';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface StoryLaneAnalyticsProps {
    data: StoryLaneRecord[];
}

// Type for sorting
type Order = 'asc' | 'desc';
type DemoOrderBy = 'name' | 'views' | 'avgComplete' | 'avgSteps' | 'ctaClicks' | 'ctaClickRate';
type CountryOrderBy = 'country' | 'count' | 'percentage';

export const StoryLaneAnalytics: React.FC<StoryLaneAnalyticsProps> = ({ data }) => {
    // Extract available demo types and months for filters
    const demoTypes = useMemo(() => {
        return [...new Set(data.map(record => record.demo))];
    }, [data]);
    
    const months = useMemo(() => {
        const monthSet = new Set<string>();
        
        data.forEach(record => {
            try {
                // Parse date (format is like "5/7/23 13:25")
                const dateParts = record.lastView.split(' ')[0].split('/');
                if (dateParts.length === 3) {
                    const month = parseInt(dateParts[0], 10);
                    const year = dateParts[2].length === 2 ? `20${dateParts[2]}` : dateParts[2];
                    const monthYear = `${year}-${month.toString().padStart(2, '0')}`;
                    monthSet.add(monthYear);
                }
            } catch (error) {
                console.error('Error parsing date:', record.lastView);
            }
        });
        
        return Array.from(monthSet).sort();
    }, [data]);

    // Extract available centre numbers for filter
    const centreNumbers = useMemo(() => {
        return [...new Set(data.map(record => record.centreNumber).filter(Boolean))];
    }, [data]);
    
    // Filter state
    const [selectedDemo, setSelectedDemo] = useState<string>('all');
    const [selectedMonth, setSelectedMonth] = useState<string>('all');
    const [selectedLocation, setSelectedLocation] = useState<string>('all');
    const [selectedQualificationType, setSelectedQualificationType] = useState<string>('all');
    const [selectedCentreNumber, setSelectedCentreNumber] = useState<string>('all');
    const [searchText, setSearchText] = useState<string>('');
    
    // Sorting state
    const [demoOrder, setDemoOrder] = useState<Order>('desc');
    const [demoOrderBy, setDemoOrderBy] = useState<DemoOrderBy>('views');
    const [countryOrder, setCountryOrder] = useState<Order>('desc');
    const [countryOrderBy, setCountryOrderBy] = useState<CountryOrderBy>('count');
    
    // Handle filter changes
    const handleDemoChange = (event: SelectChangeEvent<string>) => {
        setSelectedDemo(event.target.value);
    };
    
    const handleMonthChange = (event: SelectChangeEvent<string>) => {
        setSelectedMonth(event.target.value);
    };
    
    const handleLocationChange = (event: SelectChangeEvent<string>) => {
        setSelectedLocation(event.target.value);
    };
    
    const handleQualificationTypeChange = (event: SelectChangeEvent<string>) => {
        setSelectedQualificationType(event.target.value);
    };
    
    const handleCentreNumberChange = (event: SelectChangeEvent<string>) => {
        setSelectedCentreNumber(event.target.value);
    };
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };
    
    const clearSearch = () => {
        setSearchText('');
    };
    
    // Handle sorting changes
    const handleDemoSort = (property: DemoOrderBy) => {
        const isAsc = demoOrderBy === property && demoOrder === 'asc';
        setDemoOrder(isAsc ? 'desc' : 'asc');
        setDemoOrderBy(property);
    };
    
    const handleCountrySort = (property: CountryOrderBy) => {
        const isAsc = countryOrderBy === property && countryOrder === 'asc';
        setCountryOrder(isAsc ? 'desc' : 'asc');
        setCountryOrderBy(property);
    };
    
    // Filter the data based on selected filters
    const filteredData = useMemo(() => {
        return data.filter(record => {
            // Filter by demo type
            if (selectedDemo !== 'all' && record.demo !== selectedDemo) {
                return false;
            }
            
            // Filter by month
            if (selectedMonth !== 'all') {
                try {
                    const dateParts = record.lastView.split(' ')[0].split('/');
                    if (dateParts.length === 3) {
                        const month = parseInt(dateParts[0], 10);
                        const year = dateParts[2].length === 2 ? `20${dateParts[2]}` : dateParts[2];
                        const monthYear = `${year}-${month.toString().padStart(2, '0')}`;
                        
                        if (monthYear !== selectedMonth) {
                            return false;
                        }
                    }
                } catch (error) {
                    // If we can't parse the date, we'll skip this filter
                    console.error('Error parsing date:', record.lastView);
                }
            }
            
            // Filter by location (UK/International)
            if (selectedLocation !== 'all') {
                const countryLower = record.country.toLowerCase().trim();
                const isUK = countryLower === 'uk' || countryLower === 'united kingdom';
                
                if (selectedLocation === 'uk' && !isUK) {
                    return false;
                }
                
                if (selectedLocation === 'international' && isUK) {
                    return false;
                }
            }
            
            // Filter by qualification type (VQ/GQ)
            if (selectedQualificationType !== 'all') {
                const demoLower = record.demo.toLowerCase();
                const isVQ = demoLower.includes('pop') || 
                          demoLower.includes('btec') || 
                          demoLower.includes('cohort') || 
                          demoLower.includes('vq');
                
                if (selectedQualificationType === 'vq' && !isVQ) {
                    return false;
                }
                
                if (selectedQualificationType === 'gq' && isVQ) {
                    return false;
                }
            }
            
            // Filter by centre number
            if (selectedCentreNumber !== 'all' && record.centreNumber !== selectedCentreNumber) {
                return false;
            }
            
            // Filter by search text
            if (searchText.trim() !== '') {
                const searchLower = searchText.toLowerCase().trim();
                return (
                    record.demo.toLowerCase().includes(searchLower) ||
                    record.country.toLowerCase().includes(searchLower) ||
                    (record.centreNumber && record.centreNumber.toLowerCase().includes(searchLower)) ||
                    record.lastView.toLowerCase().includes(searchLower)
                );
            }
            
            return true;
        });
    }, [data, selectedDemo, selectedMonth, selectedLocation, selectedQualificationType, selectedCentreNumber, searchText]);
    
    // Calculate statistics based on filtered data
    const stats = useMemo(() => {
        if (filteredData.length === 0) {
            return {
                demoStats: [],
                countryData: [],
                ctaClicked: 0,
                ctaClickRate: 0,
                totalViews: 0,
                avgCompletion: 0
            };
        }
        
        // Get unique demos
        const demoNames = [...new Set(filteredData.map(record => record.demo))];
        
        // Calculate demo stats
        const demoStats = demoNames.map(demo => {
            const demoRecords = filteredData.filter(record => record.demo === demo);
            const avgComplete = demoRecords.reduce((sum, record) => sum + record.percentComplete, 0) / demoRecords.length;
            const avgSteps = demoRecords.reduce((sum, record) => sum + record.stepsCompleted, 0) / demoRecords.length;
            
            // Use the ctaClicked property directly
            const ctaClicks = demoRecords.filter(record => record.ctaClicked).length;
            
            return {
                name: demo,
                views: demoRecords.length,
                avgComplete: Math.round(avgComplete),
                avgSteps: Math.round(avgSteps * 10) / 10,
                ctaClicks,
                ctaClickRate: Math.round((ctaClicks / demoRecords.length) * 100)
            };
        });
        
        // Country breakdown
        const countryCount: Record<string, number> = {};
        filteredData.forEach(record => {
            const country = record.country.trim();
            countryCount[country] = (countryCount[country] || 0) + 1;
        });
        
        const countryData = Object.entries(countryCount)
            .map(([country, count]) => ({ 
                country, 
                count,
                percentage: Math.round((count / filteredData.length) * 100)
            }))
            .sort((a, b) => b.count - a.count);
        
        // CTA click stats (use ctaClicked property)
        const ctaClicked = filteredData.filter(record => record.ctaClicked).length;
        
        const ctaClickRate = Math.round((ctaClicked / filteredData.length) * 100);
        
        // Overall completion rate
        const avgCompletion = Math.round(
            filteredData.reduce((sum, record) => sum + record.percentComplete, 0) / filteredData.length
        );
        
        return {
            demoStats,
            countryData,
            ctaClicked,
            ctaClickRate,
            totalViews: filteredData.length,
            avgCompletion
        };
    }, [filteredData]);

    // Apply sorting to data for display
    const sortedDemoStats = useMemo(() => {
        return [...stats.demoStats].sort((a, b) => {
            if (demoOrder === 'asc') {
                if (demoOrderBy === 'name') {
                    return a.name.localeCompare(b.name);
                }
                return a[demoOrderBy] - b[demoOrderBy];
            } else {
                if (demoOrderBy === 'name') {
                    return b.name.localeCompare(a.name);
                }
                return b[demoOrderBy] - a[demoOrderBy];
            }
        });
    }, [stats.demoStats, demoOrder, demoOrderBy]);

    const sortedCountryData = useMemo(() => {
        return [...stats.countryData].sort((a, b) => {
            if (countryOrder === 'asc') {
                if (countryOrderBy === 'country') {
                    return a.country.localeCompare(b.country);
                }
                return a[countryOrderBy] - b[countryOrderBy];
            } else {
                if (countryOrderBy === 'country') {
                    return b.country.localeCompare(a.country);
                }
                return b[countryOrderBy] - a[countryOrderBy];
            }
        });
    }, [stats.countryData, countryOrder, countryOrderBy]);
    
    // Colors for pie chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
    
    // Format month for display
    const formatMonth = (monthStr: string) => {
        if (monthStr === 'all') return 'All Months';
        const [year, month] = monthStr.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };
    
    return (
        <div>
            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom component="div">Filters</Typography>
                
                {/* Search text filter */}
                <Box sx={{ mb: 2 }}>
                    <SearchBar
                        searchText={searchText}
                        onSearchChange={handleSearchChange}
                        placeholder="Search in any column (demo name, country, centre number, etc.)"
                    />
                </Box>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="demo-select-label">Demo Type</InputLabel>
                        <Select
                            labelId="demo-select-label"
                            value={selectedDemo}
                            label="Demo Type"
                            onChange={handleDemoChange}
                        >
                            <MenuItem value="all">All Demos</MenuItem>
                            {demoTypes.map(demo => (
                                <MenuItem key={demo} value={demo}>{demo}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="month-select-label">Month</InputLabel>
                        <Select
                            labelId="month-select-label"
                            value={selectedMonth}
                            label="Month"
                            onChange={handleMonthChange}
                        >
                            <MenuItem value="all">All Months</MenuItem>
                            {months.map(month => (
                                <MenuItem key={month} value={month}>{formatMonth(month)}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="location-select-label">Location</InputLabel>
                        <Select
                            labelId="location-select-label"
                            value={selectedLocation}
                            label="Location"
                            onChange={handleLocationChange}
                        >
                            <MenuItem value="all">All Locations</MenuItem>
                            <MenuItem value="uk">UK Only</MenuItem>
                            <MenuItem value="international">International Only</MenuItem>
                        </Select>
                    </FormControl>
                    
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="qualification-select-label">Qualification Type</InputLabel>
                        <Select
                            labelId="qualification-select-label"
                            value={selectedQualificationType}
                            label="Qualification Type"
                            onChange={handleQualificationTypeChange}
                        >
                            <MenuItem value="all">All Qualifications</MenuItem>
                            <MenuItem value="vq">Vocational (VQ)</MenuItem>
                            <MenuItem value="gq">General (GQ)</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="centre-number-select-label">Centre Number</InputLabel>
                        <Select
                            labelId="centre-number-select-label"
                            value={selectedCentreNumber}
                            label="Centre Number"
                            onChange={handleCentreNumberChange}
                        >
                            <MenuItem value="all">All Centres</MenuItem>
                            {centreNumbers.map(centreNumber => (
                                <MenuItem key={centreNumber} value={centreNumber}>{centreNumber}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
                
                {filteredData.length === 0 ? (
                    <Typography variant="subtitle1" sx={{ mt: 2, color: 'text.secondary' }} component="div">
                        No data matches the selected filters
                    </Typography>
                ) : (
                    <Typography variant="subtitle2" sx={{ mt: 2, color: 'text.secondary' }} component="div">
                        Showing {filteredData.length} of {data.length} records
                    </Typography>
                )}
            </Paper>
            
            {filteredData.length > 0 ? (
                <>
                    {/* Summary Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom component="div">Total Views</Typography>
                                    <Typography variant="h3" component="div">{stats.totalViews}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom component="div">Demos</Typography>
                                    <Typography variant="h3" component="div">{stats.demoStats.length}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom component="div">Avg. Completion</Typography>
                                    <Typography variant="h3" component="div">{stats.avgCompletion}%</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom component="div">CTA Click Rate</Typography>
                                    <Typography variant="h3" component="div">{stats.ctaClickRate}%</Typography>
                                    <Typography variant="caption" color="text.secondary" component="div">
                                        ({stats.ctaClicked} clicks)
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    
                    {/* Demo Stats & Country Breakdown */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {/* Demo Performance */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom component="div">Demo Performance</Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={sortedDemoStats}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="avgComplete" name="Avg. Completion %" fill="#8884d8" />
                                            <Bar dataKey="ctaClickRate" name="CTA Click Rate %" fill="#82ca9d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        {/* Country Breakdown */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom component="div">Geographic Distribution</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={sortedCountryData.slice(0, 6)}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="count"
                                                    nameKey="country"
                                                >
                                                    {sortedCountryData.slice(0, 6).map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value, name, props) => [`${value} views`, props.payload.country]} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    
                    {/* Demo Details Table */}
                    <Typography variant="h6" gutterBottom component="div">Demo Details</Typography>
                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <TableSortLabel
                                            active={demoOrderBy === 'name'}
                                            direction={demoOrderBy === 'name' ? demoOrder : 'asc'}
                                            onClick={() => handleDemoSort('name')}
                                        >
                                            Demo Name
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right">
                                        <TableSortLabel
                                            active={demoOrderBy === 'views'}
                                            direction={demoOrderBy === 'views' ? demoOrder : 'asc'}
                                            onClick={() => handleDemoSort('views')}
                                        >
                                            Views
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right">
                                        <TableSortLabel
                                            active={demoOrderBy === 'avgComplete'}
                                            direction={demoOrderBy === 'avgComplete' ? demoOrder : 'asc'}
                                            onClick={() => handleDemoSort('avgComplete')}
                                        >
                                            Avg. Completion
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right">
                                        <TableSortLabel
                                            active={demoOrderBy === 'avgSteps'}
                                            direction={demoOrderBy === 'avgSteps' ? demoOrder : 'asc'}
                                            onClick={() => handleDemoSort('avgSteps')}
                                        >
                                            Avg. Steps
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right">
                                        <TableSortLabel
                                            active={demoOrderBy === 'ctaClicks'}
                                            direction={demoOrderBy === 'ctaClicks' ? demoOrder : 'asc'}
                                            onClick={() => handleDemoSort('ctaClicks')}
                                        >
                                            CTA Clicks
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right">
                                        <TableSortLabel
                                            active={demoOrderBy === 'ctaClickRate'}
                                            direction={demoOrderBy === 'ctaClickRate' ? demoOrder : 'asc'}
                                            onClick={() => handleDemoSort('ctaClickRate')}
                                        >
                                            CTA Click Rate
                                        </TableSortLabel>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedDemoStats.map((demo) => (
                                    <TableRow key={demo.name}>
                                        <TableCell component="th" scope="row">
                                            {demo.name}
                                        </TableCell>
                                        <TableCell align="right">{demo.views}</TableCell>
                                        <TableCell align="right">{demo.avgComplete}%</TableCell>
                                        <TableCell align="right">{demo.avgSteps}</TableCell>
                                        <TableCell align="right">{demo.ctaClicks}</TableCell>
                                        <TableCell align="right">{demo.ctaClickRate}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    {/* Country Breakdown Table */}
                    <Typography variant="h6" gutterBottom component="div">Country Breakdown</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <TableSortLabel
                                            active={countryOrderBy === 'country'}
                                            direction={countryOrderBy === 'country' ? countryOrder : 'asc'}
                                            onClick={() => handleCountrySort('country')}
                                        >
                                            Country
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right">
                                        <TableSortLabel
                                            active={countryOrderBy === 'count'}
                                            direction={countryOrderBy === 'count' ? countryOrder : 'asc'}
                                            onClick={() => handleCountrySort('count')}
                                        >
                                            Views
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right">
                                        <TableSortLabel
                                            active={countryOrderBy === 'percentage'}
                                            direction={countryOrderBy === 'percentage' ? countryOrder : 'asc'}
                                            onClick={() => handleCountrySort('percentage')}
                                        >
                                            Percentage
                                        </TableSortLabel>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedCountryData.map((country) => (
                                    <TableRow key={country.country}>
                                        <TableCell component="th" scope="row">
                                            {country.country || 'Unknown'}
                                        </TableCell>
                                        <TableCell align="right">{country.count}</TableCell>
                                        <TableCell align="right">
                                            {country.percentage}%
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            ) : (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" component="div">
                        No data matches the selected filters
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} component="div">
                        Try adjusting your filters to see more results
                    </Typography>
                </Paper>
            )}
        </div>
    );
}; 