import axios from 'axios';
import Papa from 'papaparse';

const API_KEY = process.env.REACT_APP_API_KEY || '';
const BASE_URL = process.env.REACT_APP_BASE_URL || '';

const localStorageKeyPrefix = 'alphaVantage_';

const getFromCache = (key: string) => {
    const cachedData = localStorage.getItem(localStorageKeyPrefix + key);
    return cachedData ? JSON.parse(cachedData) : null;
};

const saveToCache = (key: string, data: any) => {
    localStorage.setItem(localStorageKeyPrefix + key, JSON.stringify(data));
};

const getStockData = async (symbol: string) => {
    const cacheKey = `stockData_${symbol}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                function: 'TIME_SERIES_DAILY',
                symbol: symbol,
                apikey: API_KEY,
            },
        });
        saveToCache(cacheKey, response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching stock data:', error);
        throw error;
    }
};

interface ParsedResults {
    data: any;
}

const fetchListingStatus = async () => {
    const cacheKey = 'listingStatus';
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                function: 'LISTING_STATUS',
                apikey: API_KEY,
            },
            responseType: 'blob', // important to get CSV data correctly
        });

        const data = await new Promise<any>((resolve, reject) => {
            Papa.parse(response.data, {
                header: true,
                complete: (results: ParsedResults) => resolve(results.data),
                error: (error: any) => reject(error),
            });
        });

        saveToCache(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching listing status:', error);
        throw error;
    }
};

const alphaVantageService = {
    getStockData,
    fetchListingStatus,
};

export default alphaVantageService;
