"use client"

import { keepkeyWallet } from "@coinmasters/wallet-keepkey";
import { useKeepKeyWallet } from "./contexts/WalletProvider";

export default function Home() {
  const { connectWallet, disconnectWallet, keepkeyInstance } = useKeepKeyWallet();

  console.log(keepkeyInstance)

  return (
    <div>
      {
        keepkeyInstance ? (
          <button
            onClick={async () => {
              try {
                await disconnectWallet();
                console.log("Wallet disconnected");
              } catch (error) {
                console.error(error);
              }
            }}
          >
            Disconnect Wallet
          </button>
        ) : (
          <button
            onClick={async () => {
              try {
                await connectWallet();
                console.log("Wallet connected");
                console.log(keepkeyWallet);
              } catch (error) {
                console.error(error);
              }
            }}
          >
            Connect Wallet
          </button>
        )}
    </div>
  );
}
