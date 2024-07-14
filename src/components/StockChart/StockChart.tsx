import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface StockChartProps {
    data: any;
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
    if (!data) return null;

    const timeSeries = data['Time Series (Daily)'];
    const dates = Object.keys(timeSeries).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const chartData = {
        labels: dates,
        datasets: [
            {
                label: 'Close Price',
                data: dates.map((date) => timeSeries[date]['4. close']),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: 'white',
                },
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: 'white',
                },
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: 'white',
                },
            },
            title: {
                display: true,
                text: 'Stock Prices Over Time',
                color: 'white',
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default StockChart;
