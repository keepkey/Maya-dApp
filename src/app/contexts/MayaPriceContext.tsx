'use client';
import { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
import axios from 'axios';

// Creating the context with a default value of null
const MayaPriceContext = createContext<number | null>(null);

export const useMayaPrice = () => useContext(MayaPriceContext);

interface MayaPriceProviderProps {
    children: ReactNode; // Explicitly typing the children prop
}

export const MayaPriceProvider: FC<MayaPriceProviderProps> = ({ children }) => {
    const [mayaPrice, setMayaPrice] = useState<number | null>(null);

    useEffect(() => {
        const fetchMayaPrice = async () => {
            try {
                const response = await axios.get('https://www.mayascan.org/api/maya/price?days=1');
                setMayaPrice(response.data.mayaPriceInUsd.toFixed(3));

            } catch (error) {
                console.error("Failed to fetch Maya price:", error);
            }
        };

        fetchMayaPrice();
        const intervalId = setInterval(fetchMayaPrice, 60000); // Refresh every 60 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    return (
        <MayaPriceContext.Provider value={mayaPrice}>
            {children}
        </MayaPriceContext.Provider>
    );
};
