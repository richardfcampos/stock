import React, { useEffect, useState } from 'react';
import alphaVantageService from '../../services/alphaVantage';
import StockChart from '../StockChart/StockChart';

interface StockDataProps {
    symbol: string;
}

const StockData: React.FC<StockDataProps> = ({ symbol }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (symbol) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const response = await alphaVantageService.getStockData(symbol);
                    setData(response);
                    setLoading(false);
                } catch (error) {
                    setError(error);
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [symbol]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>No data</div>;

    const timeSeries = data['Time Series (Daily)'];
    const dates = Object.keys(timeSeries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return (
        <div>
            <h2 className="text-2xl font-bold text-green-400">Stock Data for {symbol}</h2>
            <div className="h-[500px] flex justify-center">
                <StockChart data={data} />
            </div>
            <div className="overflow-x-auto mt-4">
                <table className="min-w-full bg-gray-800 border border-gray-700">
                    <thead>
                    <tr>
                        <th className="px-4 py-2 border border-gray-700 text-green-400">Date</th>
                        <th className="px-4 py-2 border border-gray-700 text-green-400">Open</th>
                        <th className="px-4 py-2 border border-gray-700 text-green-400">High</th>
                        <th className="px-4 py-2 border border-gray-700 text-green-400">Low</th>
                        <th className="px-4 py-2 border border-gray-700 text-green-400">Close</th>
                        <th className="px-4 py-2 border border-gray-700 text-green-400">Volume</th>
                    </tr>
                    </thead>
                    <tbody>
                    {dates.map((date) => (
                        <tr key={date}>
                            <td className="px-4 py-2 border border-gray-700 text-white">{date}</td>
                            <td className="px-4 py-2 border border-gray-700 text-white">{timeSeries[date]['1. open']}</td>
                            <td className="px-4 py-2 border border-gray-700 text-white">{timeSeries[date]['2. high']}</td>
                            <td className="px-4 py-2 border border-gray-700 text-white">{timeSeries[date]['3. low']}</td>
                            <td className="px-4 py-2 border border-gray-700 text-white">{timeSeries[date]['4. close']}</td>
                            <td className="px-4 py-2 border border-gray-700 text-white">{timeSeries[date]['5. volume']}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockData;
