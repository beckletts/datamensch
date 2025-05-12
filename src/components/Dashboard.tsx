import React, { useState, useMemo } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { TrainingRecord } from '../types/TrainingData';
import { Summary } from './Summary';
import { CompletionRateChart } from './charts/CompletionRateChart';
import { GeographicDistributionChart } from './charts/GeographicDistributionChart';
import { EngagementMetricsChart } from './charts/EngagementMetricsChart';
import { MonthlyBreakdown } from './MonthlyBreakdown';
import { DashboardFilters, FilterOptions } from './DashboardFilters';
// @ts-ignore - Fix TypeScript import issue
import { CategoryDetail } from './CategoryDetail';
import { getWebinarEnrollmentStats } from '../utils/dataProcessor';
import { WebinarEnrollmentTable } from './WebinarEnrollmentTable';
import { CollapsibleSection } from './CollapsibleSection';
import { StoryLaneRecord } from '../types/StoryLaneData';
import { StoryLaneAnalytics } from './StoryLaneAnalytics';

interface DashboardProps {
    data: TrainingRecord[];
    storylaneData?: StoryLaneRecord[];
}

export const Dashboard: React.FC<DashboardProps> = ({ data, storylaneData = [] }) => {
    // Default filters
    const [filters, setFilters] = useState<FilterOptions>({
        timeFrame: {
            startMonth: null,
            endMonth: null
        },
        categories: [],
        country: 'all',
        eLearningCourse: null
    });

    // Extract all webinar data regardless of date
    const allWebinarData = useMemo(() => {
        return data.filter(record => record.course.toLowerCase().includes('webinar'));
    }, [data]);

    // Get statistics for all webinars regardless of filters
    const webinarStats = useMemo(() => {
        return getWebinarEnrollmentStats(allWebinarData);
    }, [allWebinarData]);

    // Filter the data based on selected filters
    const filteredData = useMemo(() => {
        return data.filter(record => {
            // Filter by time frame
            if (filters.timeFrame.startMonth) {
                const recordDate = new Date(record.enrollmentDate);
                const monthYear = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}`;
                
                if (monthYear < filters.timeFrame.startMonth) {
                    return false;
                }
                
                if (filters.timeFrame.endMonth && monthYear > filters.timeFrame.endMonth) {
                    return false;
                }
            }
            
            // Filter by category
            if (filters.categories.length > 0) {
                let recordCategory = 'Other';
                if (record.course.toLowerCase().includes('webinar')) {
                    recordCategory = 'Webinar';
                } else if (record.course.toLowerCase().includes('recording')) {
                    recordCategory = 'Recording';
                } else {
                    recordCategory = 'eLearning';
                }
                
                if (!filters.categories.includes(recordCategory)) {
                    return false;
                }
            }
            
            // Filter by country
            if (filters.country !== 'all') {
                const isUK = record.centreCountry.toLowerCase() === 'uk' || 
                            record.centreCountry.toLowerCase() === 'united kingdom';
                
                if (filters.country === 'uk' && !isUK) {
                    return false;
                }
                
                if (filters.country === 'international' && isUK) {
                    return false;
                }
            }
            
            // Filter by eLearning course
            if (filters.eLearningCourse) {
                // Only apply if it's an eLearning course (not a webinar or recording)
                if (!record.course.toLowerCase().includes('webinar') && 
                    !record.course.toLowerCase().includes('recording')) {
                    if (record.course !== filters.eLearningCourse) {
                        return false;
                    }
                }
            }
            
            return true;
        });
    }, [data, filters]);

    // Handle filter changes
    const handleFilterChange = (newFilters: FilterOptions) => {
        setFilters(newFilters);
    };

    // Determine if we're showing a detailed category view
    const showCategoryDetail = filters.categories.length === 1;
    
    // Determine if we're showing the webinar enrollment table
    const showWebinarTable = filters.categories.length === 0 || 
        (filters.categories.length === 1 && filters.categories[0] === 'Webinar');
    
    // Determine if we should show StoryLane data
    const hasStoryLaneData = storylaneData && storylaneData.length > 0;
    
    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 4 }}>
                Training Analytics Dashboard
            </Typography>
            
            <CollapsibleSection title="Filters" defaultExpanded={true}>
                <DashboardFilters 
                    data={data} 
                    filters={filters} 
                    onFilterChange={handleFilterChange} 
                />
            </CollapsibleSection>
            
            {filteredData.length > 0 ? (
                <>
                    <CollapsibleSection title="Key Statistics" defaultExpanded={true}>
                        <Summary 
                            data={filteredData} 
                            allWebinarData={allWebinarData}
                        />
                    </CollapsibleSection>
                    
                    {showWebinarTable && (
                        <CollapsibleSection title="Webinar Enrollment Counts" defaultExpanded={true}>
                            <WebinarEnrollmentTable webinarStats={webinarStats} />
                        </CollapsibleSection>
                    )}
                    
                    <CollapsibleSection title="Storylane Analytics" defaultExpanded={true}>
                        <Paper sx={{ p: 3 }}>
                            {hasStoryLaneData ? (
                                <>
                                    <Typography variant="h6" gutterBottom>
                                        StoryLane Analytics
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <StoryLaneAnalytics data={storylaneData} />
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h6" gutterBottom>
                                        StoryLane Data Not Available
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        To enable StoryLane analytics, please add a "Storylane all.csv" file to the public folder of your application.
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        The file should contain the StoryLane training data with the following columns:
                                        demo, link, lastView, totalTime, stepsCompleted, percentComplete, openedCTA, country
                                    </Typography>
                                </>
                            )}
                        </Paper>
                    </CollapsibleSection>
                    
                    <CollapsibleSection title="Key Metrics" defaultExpanded={true}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 2 }}>
                                    <CompletionRateChart data={filteredData} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 2 }}>
                                    <GeographicDistributionChart data={filteredData} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 2 }}>
                                    <EngagementMetricsChart data={filteredData} />
                                </Paper>
                            </Grid>
                        </Grid>
                    </CollapsibleSection>
                    
                    {showCategoryDetail && (
                        <CollapsibleSection title={`${filters.categories[0]} Details`} defaultExpanded={true}>
                            <CategoryDetail 
                                data={filteredData}
                                allWebinarData={allWebinarData} 
                                category={filters.categories[0]} 
                            />
                        </CollapsibleSection>
                    )}
                    
                    <CollapsibleSection title="Monthly Breakdown" defaultExpanded={false}>
                        <MonthlyBreakdown data={filteredData} />
                    </CollapsibleSection>
                </>
            ) : (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No data matches the selected filters
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Try adjusting your filters to see more results
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};
