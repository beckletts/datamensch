import React, { useMemo } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
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
import { TrainingRecord } from '../types';

interface TrainingCoursesChartProps {
    data: TrainingRecord[];
}

export const TrainingCoursesChart: React.FC<TrainingCoursesChartProps> = ({ data }) => {
    const courseData = useMemo(() => {
        // Group data by course and calculate metrics
        const courseStats = data.reduce((acc, record) => {
            const course = record.course;
            if (!acc[course]) {
                acc[course] = {
                    name: course,
                    enrollments: 0,
                    completions: 0,
                    completionRate: 0
                };
            }
            
            acc[course].enrollments++;
            if (record.status === 'Completed') {
                acc[course].completions++;
            }
            
            return acc;
        }, {} as Record<string, { name: string; enrollments: number; completions: number; completionRate: number }>);

        // Calculate completion rates and convert to array
        return Object.values(courseStats).map(stat => ({
            ...stat,
            completionRate: Math.round((stat.completions / stat.enrollments) * 100)
        })).sort((a, b) => b.enrollments - a.enrollments);
    }, [data]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Training Courses Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={courseData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 60
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                        />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar
                            yAxisId="left"
                            dataKey="enrollments"
                            name="Enrollments"
                            fill="#8884d8"
                        />
                        <Bar
                            yAxisId="right"
                            dataKey="completionRate"
                            name="Completion Rate %"
                            fill="#82ca9d"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}; 