'use client';
import { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
import axios from 'axios';

// Creating the context with a default value of null
const CacaoPriceContext = createContext<number | null>(null);

export const useCacaoPrice = () => useContext(CacaoPriceContext);

interface CacaoPriceProviderProps {
    children: ReactNode; // Explicitly typing the children prop
}

export const CacaoPriceProvider: FC<CacaoPriceProviderProps> = ({ children }) => {
    const [cacaoPrice, setCacaoPrice] = useState<number | null>(null);

    useEffect(() => {
        const fetchCacaoPrice = async () => {
            try {
                const response = await axios.get('https://www.mayascan.org/api/cacao/price?days=1');
                const latestCandle = response.data.candles.pop(); // Assuming you want the latest price
                setCacaoPrice(latestCandle.close); // Using the close price as the current price
            } catch (error) {
                console.error("Failed to fetch CACAO price:", error);
            }
        };

        fetchCacaoPrice();
        const intervalId = setInterval(fetchCacaoPrice, 60000); // Refresh every 60 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    return (
        <CacaoPriceContext.Provider value={cacaoPrice}>
            {children}
        </CacaoPriceContext.Provider>
    );
};
