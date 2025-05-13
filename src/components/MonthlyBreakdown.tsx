import React from 'react';
import { Paper, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { TrainingRecord } from '../types/TrainingData';
import { getMonthlyBreakdown } from '../utils/dataProcessor';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyBreakdownProps {
  data: TrainingRecord[];
}

interface MonthlyData {
  month: string;
  displayName: string;
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  avgEngagement: number;
}

export const MonthlyBreakdown: React.FC<MonthlyBreakdownProps> = ({ data }) => {
  const monthlyData = getMonthlyBreakdown(data);
  
  // If we don't have multiple months of data, don't render this component
  if (!monthlyData) {
    return null;
  }
  
  const chartData = {
    labels: monthlyData.map((item: MonthlyData) => item.displayName),
    datasets: [
      {
        label: 'Completed',
        data: monthlyData.map((item: MonthlyData) => item.completed),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'In Progress',
        data: monthlyData.map((item: MonthlyData) => item.inProgress),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Not Started',
        data: monthlyData.map((item: MonthlyData) => item.notStarted),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Training Status'
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true
      }
    }
  };
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Monthly Breakdown
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Bar data={chartData} options={chartOptions} />
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Month</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Completed</TableCell>
                  <TableCell align="right">In Progress</TableCell>
                  <TableCell align="right">Not Started</TableCell>
                  <TableCell align="right">Avg. Engagement (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {monthlyData.map((item: MonthlyData) => (
                  <TableRow key={item.month}>
                    <TableCell component="th" scope="row">
                      {item.displayName}
                    </TableCell>
                    <TableCell align="right">{item.total}</TableCell>
                    <TableCell align="right">{item.completed}</TableCell>
                    <TableCell align="right">{item.inProgress}</TableCell>
                    <TableCell align="right">{item.notStarted}</TableCell>
                    <TableCell align="right">{item.avgEngagement.toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}; 