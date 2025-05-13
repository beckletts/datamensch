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
import { TrainingCoursesChart } from './TrainingCoursesChart';

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
        eLearningCourse: null,
        qualificationType: 'all'
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
            
            // Filter by qualification type
            if (filters.qualificationType !== 'all') {
                const courseLower = record.course.toLowerCase();
                const isVQ = courseLower.includes('pop') || 
                          courseLower.includes('btec') || 
                          courseLower.includes('cohort') || 
                          courseLower.includes('vq');
                
                if (filters.qualificationType === 'vq' && !isVQ) {
                    return false;
                }
                
                if (filters.qualificationType === 'gq' && isVQ) {
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
            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                    <CompletionRateChart data={filteredData} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <EngagementMetricsChart data={filteredData} />
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                    <MonthlyBreakdown data={filteredData} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <GeographicDistributionChart data={filteredData} />
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                    <TrainingCoursesChart data={filteredData} />
                </Grid>
            </Grid>
            <CollapsibleSection title="Webinar Enrollment Table" defaultExpanded>
                <WebinarEnrollmentTable data={filteredData} webinarStats={webinarStats} />
            </CollapsibleSection>
            {showCategoryDetail && (
                <CategoryDetail data={filteredData} category={filters.categories[0]} />
            )}
            {/* StoryLane Analytics Section */}
            {storylaneData && storylaneData.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        StoryLane Analytics
                    </Typography>
                    <StoryLaneAnalytics data={storylaneData} />
                </Box>
            )}
        </Box>
    );
}
