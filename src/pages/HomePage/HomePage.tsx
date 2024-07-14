import React, { useState } from 'react';
import StockData from '../../components/StockData/StockData';
import ListingStatus from '../../components/ListingStatus/ListingStatus';

const HomePage: React.FC = () => {
    const [selectedSymbol, setSelectedSymbol] = useState<string>('');

    return (
        <div className="p-4 bg-black min-h-screen text-white">
            <header className="App-header">
                <h1 className="text-3xl font-bold underline text-green-400">Stock Market</h1>
            </header>
            <main className="flex flex-col items-center">
                <div className="w-1/2 mb-4">
                    <ListingStatus onSymbolSelect={setSelectedSymbol} />
                </div>
                <div className="w-full">
                    <StockData symbol={selectedSymbol} />
                </div>
            </main>
        </div>
    );
};

export default HomePage;
