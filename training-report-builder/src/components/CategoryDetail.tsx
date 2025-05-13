import React, { useMemo } from 'react';
import { Paper, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import { TrainingRecord } from '../types/TrainingData';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getWebinarEnrollmentStats } from '../utils/dataProcessor';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface CategoryDetailProps {
  data: TrainingRecord[];
  allWebinarData?: TrainingRecord[];
  category: string;
}

export const CategoryDetail: React.FC<CategoryDetailProps> = ({ data, allWebinarData = [], category }) => {
  // Calculate metrics specific to this category
  const metrics = useMemo(() => {
    // Count by status
    const statusCounts = {
      'Completed': 0,
      'In Progress': 0,
      'Not Started': 0,
      'Unenrolled': 0
    };
    
    // Calculate average time spent
    let totalTimeSpent = 0;
    let totalProgress = 0;
    let totalWithScores = 0;
    let totalScores = 0;
    
    // Count by course name
    const courseCounts: Record<string, number> = {};
    
    data.forEach(record => {
      statusCounts[record.status] = (statusCounts[record.status] || 0) + 1;
      
      totalTimeSpent += record.timeSpentMinutes;
      totalProgress += record.progressPercentage;
      
      if (record.quizScore !== null) {
        totalWithScores++;
        totalScores += record.quizScore;
      }
      
      const courseName = record.course;
      courseCounts[courseName] = (courseCounts[courseName] || 0) + 1;
    });
    
    // Sort courses by count
    const topCourses = Object.entries(courseCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    return {
      statusCounts,
      avgTimeSpent: data.length > 0 ? totalTimeSpent / data.length : 0,
      avgProgress: data.length > 0 ? totalProgress / data.length : 0,
      avgQuizScore: totalWithScores > 0 ? totalScores / totalWithScores : 0,
      topCourses
    };
  }, [data]);
  
  // If this is the webinar category, show detailed breakdown by webinar title
  if (category === 'Webinar') {
    // Use allWebinarData if available, otherwise fall back to filtered data
    const webinarData = allWebinarData.length > 0 ? allWebinarData : data;
    const { totalWebinarEnrollments, webinarDetails } = getWebinarEnrollmentStats(webinarData);
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Webinar Details
        </Typography>
        <Typography variant="body1" paragraph>
          Total webinar enrollments: <strong>{totalWebinarEnrollments}</strong> across {webinarDetails.length} unique webinars
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Webinar Title</TableCell>
                <TableCell align="right">Enrollments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {webinarDetails.map((webinar, index) => (
                <TableRow key={index}>
                  <TableCell>{webinar.course}</TableCell>
                  <TableCell align="right">{webinar.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
  
  // For other categories
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {category} Category Details
      </Typography>
      <Typography variant="body1" paragraph>
        Total entries: {data.length}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              Status Distribution
            </Typography>
            <Pie
              data={{
                labels: ['Completed', 'In Progress', 'Not Started', 'Unenrolled'],
                datasets: [
                  {
                    data: [
                      metrics.statusCounts['Completed'] || 0,
                      metrics.statusCounts['In Progress'] || 0,
                      metrics.statusCounts['Not Started'] || 0,
                      metrics.statusCounts['Unenrolled'] || 0
                    ],
                    backgroundColor: [
                      'rgba(75, 192, 192, 0.6)',
                      'rgba(54, 162, 235, 0.6)',
                      'rgba(255, 99, 132, 0.6)',
                      'rgba(255, 159, 64, 0.6)'
                    ]
                  }
                ]
              }}
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              Top Courses
            </Typography>
            <Bar
              data={{
                labels: metrics.topCourses.map(([name]) => {
                  // Truncate long course names
                  return name.length > 25 ? name.substring(0, 25) + '...' : name;
                }),
                datasets: [
                  {
                    label: 'Participants',
                    data: metrics.topCourses.map(([_, count]) => count),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)'
                  }
                ]
              }}
              options={{
                indexAxis: 'y' as const,
                scales: {
                  x: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Participants'
                    }
                  }
                }
              }}
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Metric</TableCell>
                  <TableCell align="right">Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Total Records</TableCell>
                  <TableCell align="right">{data.length}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Completion Rate</TableCell>
                  <TableCell align="right">
                    {data.length > 0 
                      ? ((metrics.statusCounts['Completed'] || 0) / data.length * 100).toFixed(1) + '%'
                      : '0%'
                    }
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average Time Spent</TableCell>
                  <TableCell align="right">{metrics.avgTimeSpent.toFixed(1)} minutes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average Progress</TableCell>
                  <TableCell align="right">{metrics.avgProgress.toFixed(1)}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average Quiz Score</TableCell>
                  <TableCell align="right">
                    {metrics.avgQuizScore > 0 
                      ? metrics.avgQuizScore.toFixed(1) + '%'
                      : 'N/A'
                    }
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}; 