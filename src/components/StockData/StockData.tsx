import React, { useEffect, useState } from 'react';
import alphaVantageService from '../../services/alphaVantage';
import StockChart from '../StockChart/StockChart';
import TableColumn from "../TableColumn/TableColumn";
import TableDataCell from "../TableDataCell/TableDataCell";
import StockDataInterface, { StockDataErrorInterface , isStockDataErrorInterface} from "../../interfaces/StockDataInterface";


interface StockDataProps {
    symbol: string;
}

const columns = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume'];

const StockData: React.FC<StockDataProps> = ({ symbol }) => {
    const [data, setData] = useState<StockDataInterface | StockDataErrorInterface | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    useEffect((): void => {
        if (symbol) {
            const fetchData = async (): Promise<void> => {
                setLoading(true);
                try {
                    const response: StockDataInterface | StockDataErrorInterface = await alphaVantageService.getStockData(symbol);
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

    if (isStockDataErrorInterface(data)) {
        return <div>Error: {data.Information}</div>;
    }

    const timeSeries = data['Time Series (Daily)'];
    const dates: string[] = Object.keys(timeSeries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

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
                        {columns.map((column: string, index: number) => (
                            <TableColumn key={index}>{column}</TableColumn>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {dates.map((date: string) => (
                        <tr key={date}>
                            <TableDataCell>{date}</TableDataCell>
                            <TableDataCell>{timeSeries[date]['1. open']}</TableDataCell>
                            <TableDataCell>{timeSeries[date]['2. high']}</TableDataCell>
                            <TableDataCell>{timeSeries[date]['3. low']}</TableDataCell>
                            <TableDataCell>{timeSeries[date]['4. close']}</TableDataCell>
                            <TableDataCell>{timeSeries[date]['5. volume']}</TableDataCell>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockData;
