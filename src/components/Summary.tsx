import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { TrainingRecord } from '../types/TrainingData';
import { 
    calculateCompletionRates, 
    calculateGeographicDistribution, 
    calculateEngagementMetrics,
    getWebinarEnrollmentStats
} from '../utils/dataProcessor';

interface SummaryProps {
    data: TrainingRecord[];
    allWebinarData?: TrainingRecord[];
}

export const Summary: React.FC<SummaryProps> = ({ data, allWebinarData = [] }) => {
    const completionRates = calculateCompletionRates(data);
    const distribution = calculateGeographicDistribution(data);
    const engagement = calculateEngagementMetrics(data);

    // Calculate average completion rate
    const avgCompletionRate = (
        (completionRates.liveWebinar + completionRates.recording + completionRates.eLearning) / 3
    ).toFixed(1);

    // Calculate UK participation percentage
    const ukPercentage = data.length > 0 
        ? ((distribution.uk / data.length) * 100).toFixed(1) 
        : "0.0";
    
    // Get all webinar enrollments regardless of enrollment date
    // Use allWebinarData to get total counts for all webinars
    const { totalWebinarEnrollments } = getWebinarEnrollmentStats(
        allWebinarData.length > 0 ? allWebinarData : data
    );

    return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Key Statistics
                </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                        Webinar Enrollments
                    </Typography>
                    <Typography variant="h4">
                        {totalWebinarEnrollments}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                        Average Completion Rate
                    </Typography>
                    <Typography variant="h4">
                        {avgCompletionRate}%
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                        UK Participation
                    </Typography>
                    <Typography variant="h4">
                        {ukPercentage}%
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                        Avg. Time Spent
                    </Typography>
                    <Typography variant="h4">
                        {engagement.timeSpent.toFixed(1)} min
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
};
