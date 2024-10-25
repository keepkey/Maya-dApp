import { useContext } from 'react';
// Import necessary contexts or utilities
import { AssetValue } from '@coinmasters/core';

export function useHandleTransfer(keepkeyInstance: any) {
    const handleTransfer = async (asset: string, amount: number, destination: string, memo: string) => {

        if (!asset || !amount) return;

        if (keepkeyInstance.MAYA.walletMethods) {

            try {
                const assetString = `MAYA.${asset}`;
                await AssetValue.loadStaticAssets();

                let assetValue = await AssetValue.fromString(
                    assetString,
                    amount
                );

                let sendPayload = {
                    assetValue,
                    memo,
                    recipient: destination,
                };
                console.log('sendPayload: ', sendPayload);
                const txHash = await keepkeyInstance.MAYA.walletMethods.transfer(sendPayload);
                console.log("txHash: ", 'https://www.explorer.mayachain.info/tx/' + String(txHash.txid));
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
