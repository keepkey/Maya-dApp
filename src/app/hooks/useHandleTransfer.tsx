// hooks/useHandleTransfer.ts

import { useContext } from 'react';
// Import necessary contexts or utilities
import { AssetValue } from '@coinmasters/core';

export function useHandleTransfer(keepkeyInstance: any) {
    const handleTransfer = async (asset: string, amount: number, destination: string) => {
        console.log("handleTransfer: ", asset, amount, destination);
        console.log("keepkeyInstance: ", keepkeyInstance);
        console.log("asset: ", asset, "amount: ", amount, "destination: ", destination);
        if (!asset || !amount) return;
        console.log(keepkeyInstance)
        console.log("Available keys in keepKey:", Object.keys(keepkeyInstance));

        if (asset === "CACAO" && keepkeyInstance.MAYA.walletMethods) {
            console.log(keepkeyInstance.MAYA.walletMethods)
            try {
                const assetString = `MAYA.${asset}`;
                await AssetValue.loadStaticAssets();

                let assetValue = await AssetValue.fromString(
                    assetString,
                    amount
                );

                let sendPayload = {
                    assetValue,
                    memo: 'Weed Saves Lives',
                    recipient: destination,
                };

                const txHash = await keepkeyInstance.MAYA.walletMethods.transfer(sendPayload);
                console.log("txHash: ", 'https://www.mayascan.org/tx/' + String(txHash.txid));
                console.log("Transfer successful");
                return txHash; // Optionally return transaction hash or result
            } catch (error) {
                console.error("Transfer failed", error);
                throw error; // Rethrow or handle error as needed
            }
        }
    };

    return handleTransfer;
}
