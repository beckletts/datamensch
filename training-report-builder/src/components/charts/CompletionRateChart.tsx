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
import { calculateCompletionRates } from '../../utils/dataProcessor';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface CompletionRateChartProps {
    data: TrainingRecord[];
}

export const CompletionRateChart: React.FC<CompletionRateChartProps> = ({ data }) => {
    const completionRates = calculateCompletionRates(data);

    const chartData = {
        labels: ['Live Webinars (Registration)', 'Recordings (Completion)', 'eLearning (Completion)'],
        datasets: [
            {
                label: 'Success Rate (%)',
                data: [
                    completionRates.liveWebinar,
                    completionRates.recording,
                    completionRates.eLearning
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ]
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Success Rates by Training Type'
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y || 0;
                        return `${label}: ${value.toFixed(1)}%`;
                    },
                    footer: function(tooltipItems: any) {
                        const dataIndex = tooltipItems[0].dataIndex;
                        if (dataIndex === 0) {
                            return 'Live webinars measured by registration rate';
                        } else {
                            return 'Measured by completion rate';
                        }
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    };

    return <Bar data={chartData} options={options} />;
}; 