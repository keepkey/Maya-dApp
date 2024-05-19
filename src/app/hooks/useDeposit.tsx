import { useContext } from 'react';
// Import necessary contexts or utilities
import { AssetValue } from '@coinmasters/core';

export function useHandleDeposit(keepkeyInstance: any) {
    const handleDeposit = async (asset: string, amount: number, memo: string) => {
        console.log("useHandleDeposit: ", asset, amount);
        console.log("keepkeyInstance: ", keepkeyInstance);
        console.log("asset: ", asset, "amount: ", amount)
        if (!asset || !amount) return;
        console.log(keepkeyInstance)
        console.log("Available keys in keepKey:", Object.keys(keepkeyInstance));

        if (keepkeyInstance.MAYA.walletMethods) {
            console.log(keepkeyInstance.MAYA)

            console.log(keepkeyInstance.MAYA.walletMethods)
            try {
                const assetString = `MAYA.${asset}`;
                await AssetValue.loadStaticAssets();

                let assetValue = await AssetValue.fromString(
                    assetString,
                    amount
                );
                console.log("assetValue: ", assetValue);

                let sendPayload = {
                    assetValue,
                    memo,
                    // recipient: destination,
                };
                const txHash = await keepkeyInstance.MAYA.walletMethods.deposit(sendPayload);
                console.log("txHash: ", 'https://www.mayascan.org/tx/' + String(txHash.txid));
                console.log("Transfer successful");
                return txHash; // Optionally return transaction hash or result
            } catch (error) {
                console.error("Transfer failed", error);
                throw error; // Rethrow or handle error as needed
            }
        }
    };

    return handleDeposit;
}
