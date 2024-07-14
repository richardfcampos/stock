import React, { useState, useEffect } from 'react';
import alphaVantageService from '../../services/alphaVantage';
import SearchableSelect from '../SearchableSelect/SearchableSelect';
import SymbolsList from '../../interfaces/SymbolsList';

interface ListingStatusProps {
    onSymbolSelect: (symbol: string) => void;
}

const ListingStatus: React.FC<ListingStatusProps> = ({ onSymbolSelect }) => {
    const [listingStatus, setListingStatus] = useState<SymbolsList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const data: SymbolsList[] = await alphaVantageService.fetchListingStatus();
                setListingStatus(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const options = listingStatus.map((item: SymbolsList): {label: string, value: string} => ({
        value: item.symbol,
        label: `${item.symbol} - ${item.name}`,
    }));

    const handleSelect = (selectedOption: { value: string } | null): void => {
        onSymbolSelect(selectedOption ? selectedOption.value : '');
    };

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">Select a Stock Symbol</h2>
            <SearchableSelect options={options} onSelect={handleSelect} />
        </div>
    );
};

export default ListingStatus;
