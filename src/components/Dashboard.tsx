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

interface DashboardProps {
    data: TrainingRecord[];
}

export const Dashboard = ({ data }: DashboardProps) => {
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

    // Apply filters to data
    const filteredData = useMemo(() => {
        return data.filter(record => {
            // Filter by time frame
            if (filters.timeFrame.startMonth && filters.timeFrame.endMonth) {
                const enrollmentDate = new Date(record.enrollmentDate);
                const startDate = new Date(filters.timeFrame.startMonth);
                const endDate = new Date(filters.timeFrame.endMonth);
                
                // Set end date to the end of the month
                endDate.setMonth(endDate.getMonth() + 1);
                endDate.setDate(0);
                
                if (enrollmentDate < startDate || enrollmentDate > endDate) {
                    return false;
                }
            }
            
            // Filter by category
            if (filters.categories.length > 0) {
                const course = record.course.toLowerCase();
                
                if (filters.categories.includes('Webinar') && 
                    course.includes('webinar')) {
                    return true;
                }
                
                if (filters.categories.includes('Recording') && 
                    course.includes('recording')) {
                    return true;
                }
                
                if (filters.categories.includes('eLearning') && 
                    !course.includes('webinar') && 
                    !course.includes('recording')) {
                    return true;
                }
                
                // If we get here, the course doesn't match any of the selected categories
                return false;
            }
            
            // Filter by country
            if (filters.country !== 'all') {
                if (record.centreCountry !== filters.country) {
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
    
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Training Report Dashboard
            </Typography>
            
            <DashboardFilters 
                filters={filters} 
                onFilterChange={handleFilterChange}
                data={data}
            />
            
            <CollapsibleSection title="Webinar Statistics" defaultExpanded={true}>
                <WebinarEnrollmentTable 
                    webinarStats={webinarStats}
                />
            </CollapsibleSection>
            
            {filteredData.length > 0 ? (
                <>
                    <Summary 
                        data={filteredData} 
                        allWebinarData={allWebinarData}
                    />
                    
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