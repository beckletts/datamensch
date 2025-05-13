import React from 'react';
import { 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Typography
} from '@mui/material';
import { StoryLaneRecord } from '../types/StoryLaneData';
import { getStoryLaneDemoStats } from '../utils/storylaneDataProcessor';

interface StoryLaneDemoTableProps {
    data: StoryLaneRecord[];
}

export const StoryLaneDemoTable: React.FC<StoryLaneDemoTableProps> = ({ data }) => {
    // Get unique demo names
    const demoNames = Array.from(new Set(data.map(record => record.demo))).sort();
    
    if (demoNames.length === 0) {
        return (
            <Typography variant="body1" color="text.secondary" align="center">
                No demo data available
            </Typography>
        );
    }
    
    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Demo</strong></TableCell>
                        <TableCell align="right"><strong>Total Views</strong></TableCell>
                        <TableCell align="right"><strong>Avg Steps Completed</strong></TableCell>
                        <TableCell align="right"><strong>Avg Completion %</strong></TableCell>
                        <TableCell align="right"><strong>CTA Clicks</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {demoNames.map(demoName => {
                        const stats = getStoryLaneDemoStats(data, demoName);
                        return (
                            <TableRow key={demoName} hover>
                                <TableCell component="th" scope="row">
                                    {demoName}
                                </TableCell>
                                <TableCell align="right">{stats.totalViews}</TableCell>
                                <TableCell align="right">
                                    {stats.avgStepsCompleted.toFixed(1)}
                                </TableCell>
                                <TableCell align="right">
                                    {(stats.avgPercentComplete * 100).toFixed(1)}%
                                </TableCell>
                                <TableCell align="right">
                                    {stats.ctaClicks > 0 ? stats.ctaClicks : 'N/A'}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}; 