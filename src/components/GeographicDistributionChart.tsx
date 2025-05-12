import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { TrainingRecord } from '../types/TrainingData';
import { calculateGeographicDistribution } from '../utils/dataProcessor';

ChartJS.register(ArcElement, Tooltip, Legend);

interface GeographicDistributionChartProps {
    data: TrainingRecord[];
}

export const GeographicDistributionChart: React.FC<GeographicDistributionChartProps> = ({ data }) => {
    const distribution = calculateGeographicDistribution(data);

    const chartData = {
        labels: ['UK', 'International'],
        datasets: [
            {
                data: [distribution.uk, distribution.international],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)'
                ]
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Geographic Distribution'
            }
        }
    };

    return <Pie data={chartData} options={options} />;
};
