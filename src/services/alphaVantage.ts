import axios from 'axios';
import Papa from 'papaparse';
import SymbolsList from '../interfaces/SymbolsList';
import StockDataInterface, { StockDataErrorInterface } from "../interfaces/StockDataInterface";

const API_KEY = process.env.REACT_APP_API_KEY || '';
const BASE_URL = process.env.REACT_APP_BASE_URL || '';

const localStorageKeyPrefix = 'alphaVantage_';

//cache created, we only have 15 api calls per day, this helps to not run out of data fast and helps performance
const getFromCache = (key: string) => {
    const cachedData: string | null = localStorage.getItem(localStorageKeyPrefix + key);
    return cachedData ? JSON.parse(cachedData) : null;
};

const saveToCache = (key: string, data: any) => {
    localStorage.setItem(localStorageKeyPrefix + key, JSON.stringify(data));
};

const getStockData = async (symbol: string): Promise<StockDataInterface | StockDataErrorInterface> => {
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
    data: SymbolsList[];
}

const fetchListingStatus = async (): Promise<SymbolsList[]> => {
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

        const data = await new Promise<SymbolsList[]>((resolve, reject) => {
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
