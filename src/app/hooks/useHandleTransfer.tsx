// hooks/useHandleTransfer.ts

import { useContext } from 'react';
// Import necessary contexts or utilities
import { AssetValue } from '@coinmasters/core';

export function useHandleTransfer(keepkeyInstance: any) {
    const handleTransfer = async (asset: string, amount: number, destination: string) => {

        if (!asset || !amount) return;


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
                    memo: 'Sending Cacao',
                    recipient: destination,
                };

                const txHash = await keepkeyInstance.MAYA.walletMethods.transfer(sendPayload);

                return txHash; // Optionally return transaction hash or result
            } catch (error) {
                console.error("Transfer failed", error);
                throw error; // Rethrow or handle error as needed
            }
        }
    };

    return handleTransfer;
}
