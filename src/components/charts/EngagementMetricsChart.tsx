import React from 'react';
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
import { TrainingRecord } from '../../types/TrainingData';
import { calculateEngagementMetrics } from '../../utils/dataProcessor';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface EngagementMetricsChartProps {
    data: TrainingRecord[];
}

export const EngagementMetricsChart: React.FC<EngagementMetricsChartProps> = ({ data }) => {
    const engagement = calculateEngagementMetrics(data);

    const chartData = {
        labels: ['Time Spent (min)', 'Progress (%)'],
        datasets: [
            {
                label: 'Engagement Metrics',
                data: [
                    engagement.timeSpent,
                    engagement.progressPercentage
                ],
                backgroundColor: [
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                ]
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Engagement Metrics'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return <Bar data={chartData} options={options} />;
};
