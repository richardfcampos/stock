import React, { useState, useEffect } from 'react';
import alphaVantageService from '../../services/alphaVantage';
import SearchableSelect from '../SearchableSelect/SearchableSelect';

interface ListingStatusProps {
    onSymbolSelect: (symbol: string) => void;
}

const ListingStatus: React.FC<ListingStatusProps> = ({ onSymbolSelect }) => {
    const [listingStatus, setListingStatus] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await alphaVantageService.fetchListingStatus();
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

    const options = listingStatus.map((item) => ({
        value: item.symbol,
        label: `${item.symbol} - ${item.name}`,
    }));

    const handleSelect = (selectedOption: { value: string } | null) => {
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
