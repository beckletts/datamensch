import React from 'react';
import { 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Typography,
    Box,
    Grid
} from '@mui/material';

// Define interface directly for simplicity
interface StoryLaneRecord {
    demo: string;
    link: string;
    lastView: string;
    totalTime: string;
    stepsCompleted: number;
    percentComplete: number;
    openedCTA: string;
    country: string;
}

interface Props {
    data: StoryLaneRecord[];
}

export const StoryLaneAnalytics: React.FC<Props> = ({ data }) => {
    // Group data by demo type
    const demoStats = React.useMemo(() => {
        const demoMap: Record<string, StoryLaneRecord[]> = {};
        
        // Group records by demo
        data.forEach(record => {
            if (!demoMap[record.demo]) {
                demoMap[record.demo] = [];
            }
            demoMap[record.demo].push(record);
        });
        
        // Calculate statistics for each demo
        return Object.entries(demoMap).map(([demo, records]) => {
            const totalSteps = records.reduce((sum, r) => sum + r.stepsCompleted, 0);
            const totalPercent = records.reduce((sum, r) => sum + r.percentComplete, 0);
            const ctaClicks = records.filter(r => r.openedCTA && r.openedCTA !== '-').length;
            
            // Group by country
            const countries: Record<string, number> = {};
            records.forEach(r => {
                const country = r.country.trim();
                if (country) {
                    countries[country] = (countries[country] || 0) + 1;
                }
            });
            
            return {
                demo,
                count: records.length,
                avgSteps: totalSteps / records.length,
                avgPercent: totalPercent / records.length,
                ctaClicks,
                countries
            };
        }).sort((a, b) => b.count - a.count); // Sort by most viewed
    }, [data]);
    
    // Count records by country
    const countryCounts = React.useMemo(() => {
        const counts: Record<string, number> = {};
        
        data.forEach(record => {
            const country = record.country.trim();
            if (country) {
                counts[country] = (counts[country] || 0) + 1;
            }
        });
        
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10); // Top 10 countries
    }, [data]);
    
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Storylane Analytics - {data.length} Records
            </Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Demo Engagement Metrics
                        </Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Demo</strong></TableCell>
                                        <TableCell align="right"><strong>Views</strong></TableCell>
                                        <TableCell align="right"><strong>Avg Steps</strong></TableCell>
                                        <TableCell align="right"><strong>Avg %</strong></TableCell>
                                        <TableCell align="right"><strong>CTA Clicks</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {demoStats.map(stat => (
                                        <TableRow key={stat.demo} hover>
                                            <TableCell>{stat.demo}</TableCell>
                                            <TableCell align="right">{stat.count}</TableCell>
                                            <TableCell align="right">
                                                {stat.avgSteps.toFixed(1)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {(stat.avgPercent * 100).toFixed(1)}%
                                            </TableCell>
                                            <TableCell align="right">
                                                {stat.ctaClicks > 0 ? stat.ctaClicks : 'N/A'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Top Countries
                        </Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Country</strong></TableCell>
                                        <TableCell align="right"><strong>Views</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {countryCounts.map(([country, count]) => (
                                        <TableRow key={country} hover>
                                            <TableCell>{country}</TableCell>
                                            <TableCell align="right">{count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}; 