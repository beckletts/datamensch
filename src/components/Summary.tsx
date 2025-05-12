import React, { useMemo } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { TrainingRecord } from '../types/TrainingData';
import { 
    calculateCompletionRates, 
    calculateGeographicDistribution, 
    calculateEngagementMetrics,
    getWebinarEnrollmentStats
} from '../utils/dataProcessor';
import { StoryLaneRecord } from '../types/StoryLaneData';

interface SummaryProps {
    data: TrainingRecord[];
    allWebinarData?: TrainingRecord[];
    storylaneData?: StoryLaneRecord[];
}

export const Summary: React.FC<SummaryProps> = ({ 
    data, 
    allWebinarData = [],
    storylaneData = []
}) => {
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

    // Calculate the four key metrics
    const metrics = useMemo(() => {
        // 1. Total webinar registrations
        const webinarRegistrations = data.filter(record => 
            record.course.toLowerCase().includes('webinar')
        ).length;
        
        // 2. Total recording viewings
        const recordingViewings = data.filter(record =>
            record.course.toLowerCase().includes('recording')
        ).length;
        
        // 3. Total completed eLearning
        const completedELearning = data.filter(record =>
            !record.course.toLowerCase().includes('webinar') &&
            !record.course.toLowerCase().includes('recording') &&
            record.status === 'Completed'
        ).length;
        
        // 4. Total Storylane views
        const storylaneViews = storylaneData.length;
        
        return {
            webinarRegistrations,
            recordingViewings,
            completedELearning,
            storylaneViews
        };
    }, [data, storylaneData]);

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
                        {metrics.webinarRegistrations}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                        Storylane Views
                    </Typography>
                    <Typography variant="h4">
                        {metrics.storylaneViews}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                        Recording Views
                    </Typography>
                    <Typography variant="h4">
                        {metrics.recordingViewings}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                        Completed eLearning
                    </Typography>
                    <Typography variant="h4">
                        {metrics.completedELearning}
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
};
