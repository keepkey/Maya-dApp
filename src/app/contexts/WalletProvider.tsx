'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';


// Define the interface for your wallet details
interface KeepKeyWallet {
    type: string;
    icon: string;
    chains: string[];
    wallet: any;
    status: string;
    isConnected: boolean;
}

//@ts-ignore
import { getPaths } from "@pioneer-platform/pioneer-coins"; // Corrected import to use the new hook
//@ts-ignore
import { ChainToNetworkId, getChainEnumValue } from '@coinmasters/types';


// Define the type for the context state
interface WalletContextType {
    keepkeyInstance: KeepKeyWallet | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface KeepKeyWalletProviderProps {
    children: ReactNode;
}

const getWalletByChain = async (keepkey: any, chain: any) => {
    if (!keepkey[chain]) return null;

    const walletMethods = keepkey[chain].walletMethods;
    const address = await walletMethods.getAddress();
    if (!address) return null;

    let balance = [];
    if (walletMethods.getPubkeys) {
        const pubkeys = await walletMethods.getPubkeys();
        for (const pubkey of pubkeys) {
            const pubkeyBalance = await walletMethods.getBalance([{ pubkey }]);
            balance.push(Number(pubkeyBalance[0].toFixed(pubkeyBalance[0].decimal)) || 0);
        }
        balance = [{ total: balance.reduce((a, b) => a + b, 0), address }];
    } else {
        balance = await walletMethods.getBalance([{ address }]);
    }

    return { address, balance };
};


export const KeepKeyWalletProvider = ({ children }: KeepKeyWalletProviderProps) => {
    const [keepkeyInstance, setKeepKeyInstance] = useState<KeepKeyWallet | null>(null);
    const initWallet = async () => {
        try {
            // let chains =  [
            //     'ARB',  'AVAX', 'BNB',
            //     'BSC',  'BTC',  'BCH',
            //     'GAIA', 'OSMO', 'XRP',
            //     'DOGE', 'DASH', 'ETH',
            //     'LTC',  'OP',   'MATIC',
            //     'THOR'
            // ]

            const chains = ['ETH']; // Example chains
            // @ts-ignore
            const { keepkeyWallet } = await import('@coinmasters/wallet-keepkey');
            const walletKeepKey: KeepKeyWallet = {
                type: 'KEEPKEY',
                icon: 'https://pioneers.dev/coins/keepkey.png',
                chains,
                wallet: keepkeyWallet,
                status: 'offline',
                isConnected: false,
            };

            const allByCaip = chains.map((chainStr) => {
                const chain = getChainEnumValue(chainStr);
                if (chain) {
                    return ChainToNetworkId[chain];
                }
                return undefined;
            });
            const paths = getPaths(allByCaip);
            let keepkey: any = {};
            // @ts-ignore
            // Implement the addChain function with additional logging
            function addChain({ chain, walletMethods, wallet }) {
                keepkey[chain] = {
                    walletMethods,
                    wallet
                };
            }

            let keepkeyConfig = {
                apiKey: localStorage.getItem('keepkeyApiKey') || '123',
                pairingInfo: {
                    name: "Keepkey Template",
                    imageUrl: "https://i.pinimg.com/originals/24/77/56/247756ac928c5f60fc786aef33485f17.jpg",
                    basePath: 'http://localhost:1646/spec/swagger.json',
                    url: 'http://localhost:1646',
                }
            }
            let covalentApiKey = process.env['NEXT_PUBLIC_COVALENT_API_KEY']
            let ethplorerApiKey = process.env['NEXT_PUBLIC_ETHPLORER_API_KEY']
            let utxoApiKey = process.env['NEXT_PUBLIC_BLOCKCHAIR_API_KEY']
            let input = {
                apis: {},
                rpcUrls: {},
                addChain,
                config: { keepkeyConfig, covalentApiKey, ethplorerApiKey, utxoApiKey },
            }

            // Step 1: Invoke the outer function with the input object
            const connectFunction = walletKeepKey.wallet.connect(input);

            // Step 2: Invoke the inner function with chains and paths
            let kkApikey = await connectFunction(chains, paths);
            localStorage.setItem('keepkeyApiKey', kkApikey);

            //got balances
            for (let i = 0; i < chains.length; i++) {
                let chain = chains[i]
                let walletData: any = await getWalletByChain(keepkey, chain);
                // keepkey[chain].wallet.address = walletData.address
                keepkey[chain].wallet.balance = walletData.balance
            }

            return keepkey;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to initialize wallet');
        }
    };
    const connectWallet = async () => {
        try {
            let keepkeyInit = await initWallet();
            setKeepKeyInstance(keepkeyInit)
            localStorage.setItem('connected', "true");
        } catch (error) {
            console.error("Failed to initialize wallet", error);
        }
    };

    const disconnectWallet = async () => {
        try {
            setKeepKeyInstance(null)
            localStorage.setItem('connected', "false");
        } catch (error) {
            console.error("Failed to disconnect wallet", error);
        }
    };

    // When start verify if user is connected
    useEffect(() => {
        // If yes, init the wallet object
        const isConnected = localStorage.getItem('connected');
        if (isConnected === "true") connectWallet()
    }, [])


    return (
        <WalletContext.Provider value={{ keepkeyInstance, connectWallet, disconnectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useKeepKeyWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useKeepKeyWallet must be used within a KeepKeyWalletProvider');
    }
    return {
        connectWallet: context.connectWallet,
        keepkeyInstance: context.keepkeyInstance,
        disconnectWallet: context.disconnectWallet
    };
}