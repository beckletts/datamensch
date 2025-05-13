import React, { useMemo } from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from 'recharts';
import { Typography, Box } from '@mui/material';
import { StoryLaneRecord } from '../../types/StoryLaneData';

interface StoryLaneCountryChartProps {
    data: StoryLaneRecord[];
}

export const StoryLaneCountryChart: React.FC<StoryLaneCountryChartProps> = ({ data }) => {
    const countryData = useMemo(() => {
        const countryCounts: Record<string, number> = {};
        
        // Count occurrences of each country
        data.forEach(record => {
            const country = record.country.trim();
            if (country) {
                countryCounts[country] = (countryCounts[country] || 0) + 1;
            }
        });
        
        // Convert to array of objects for the chart
        return Object.entries(countryCounts)
            .map(([country, count]) => ({ country, count }))
            .sort((a, b) => b.count - a.count) // Sort by count in descending order
            .slice(0, 10); // Take top 10 countries
    }, [data]);
    
    if (countryData.length === 0) {
        return (
            <Typography variant="body1" color="text.secondary" align="center">
                No country data available
            </Typography>
        );
    }
    
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Engagement by Country
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={countryData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of Views" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}; 