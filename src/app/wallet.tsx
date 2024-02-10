// app/wallet.tsx
"use client";

import {
    Button,
    Image,
    Spinner,
    VStack,
} from '@chakra-ui/react';

import { useState } from "react";
//@ts-ignore
import { getPaths } from "@pioneer-platform/pioneer-coins"; // Corrected import to use the new hook
//@ts-ignore
import { ChainToNetworkId, getChainEnumValue } from '@coinmasters/types';


interface KeepKeyWallet {
    type: string;
    icon: string;
    chains: string[];
    wallet: any;
    status: string;
    isConnected: boolean;
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


export default function Wallet({ setKeepKey, keepkey }: any) {
    const [asset, setAsset] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [destination, setDestination] = useState<string>(""); // Add destination state if required
    const [keepkeyInstance, setKeepKeyInstance] = useState<KeepKeyWallet | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    let initWallet = async (): Promise<KeepKeyWallet> => {
        try {
            // let chains =  [
            //     'ARB',  'AVAX', 'BNB',
            //     'BSC',  'BTC',  'BCH',
            //     'GAIA', 'OSMO', 'XRP',
            //     'DOGE', 'DASH', 'ETH',
            //     'LTC',  'OP',   'MATIC',
            //     'THOR'
            // ]

            const chains = ['MAYA']; // Example chains
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
            console.log('paths: ', paths);
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
                    name: "int-test-package",
                    imageUrl: "",
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

    const init = async () => {
        try {
            let keepkeyInit = await initWallet();
            setKeepKey(keepkeyInit);
            setKeepKeyInstance(keepkeyInit)
        } catch (error) {
            console.error("Failed to initialize wallet", error);
        }
    };

    return (
        <div>
            <VStack>
                <Image
                    src={"https://pbs.twimg.com/profile_images/1610392637814759424/MPu7ZSLt_400x400.jpg"}
                    alt={"KeepKey Logo"}
                    boxSize={"100px"}
                    borderRadius={"100%"}
                />
                <Button
                    leftIcon={<Image boxSize={"24px"} src={"https://keepkey.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fkeepkey_logo.407f5aca.png&w=3840&q=100"} />}
                    p={5}
                    onClick={init}
                    borderRadius={5}
                    backgroundColor={"black"}
                >
                    Connect Wallet
                </Button>

                {isLoaded ? <Spinner size="48px" /> : null}
                <br />
            </VStack>

        </div>
    );
}
