import React, { useState } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    TableSortLabel,
    TextField,
    InputAdornment,
    Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface WebinarDetail {
    course: string;
    count: number;
}

interface WebinarEnrollmentTableProps {
    webinarStats: {
        totalWebinarEnrollments: number;
        webinarDetails: WebinarDetail[];
    };
}

type SortDirection = 'asc' | 'desc';

export const WebinarEnrollmentTable: React.FC<WebinarEnrollmentTableProps> = ({ webinarStats }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'course' | 'count'>('count');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    // Handle search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Handle sorting
    const handleSortRequest = (property: 'course' | 'count') => {
        const isAsc = sortBy === property && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortBy(property);
    };

    // Filter and sort webinar details
    const filteredAndSortedWebinars = React.useMemo(() => {
        return webinarStats.webinarDetails
            .filter(webinar => 
                webinar.course.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                if (sortBy === 'course') {
                    return sortDirection === 'asc' 
                        ? a.course.localeCompare(b.course)
                        : b.course.localeCompare(a.course);
                } else {
                    return sortDirection === 'asc' 
                        ? a.count - b.count
                        : b.count - a.count;
                }
            });
    }, [webinarStats.webinarDetails, searchTerm, sortBy, sortDirection]);
    
    return (
        <>
            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search webinars..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={sortBy === 'course'}
                                    direction={sortBy === 'course' ? sortDirection : 'asc'}
                                    onClick={() => handleSortRequest('course')}
                                >
                                    Webinar Title
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={sortBy === 'count'}
                                    direction={sortBy === 'count' ? sortDirection : 'asc'}
                                    onClick={() => handleSortRequest('count')}
                                >
                                    Enrollments
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAndSortedWebinars.map((webinar, index) => (
                            <TableRow key={index}>
                                <TableCell>{webinar.course}</TableCell>
                                <TableCell align="right">{webinar.count}</TableCell>
                            </TableRow>
                        ))}
                        {filteredAndSortedWebinars.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={2} align="center">
                                    No webinars matching your search
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}; 