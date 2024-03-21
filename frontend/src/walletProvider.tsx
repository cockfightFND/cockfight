import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { Aptos, AptosConfig, ClientConfig, Network } from "@aptos-labs/ts-sdk"
import { useEffect } from "react"

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react"
import { PetraWallet } from "petra-plugin-wallet-adapter"

import React, { ReactNode } from "react"

interface WalletProviderProps {
  chain: number
  children: ReactNode
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ chain, children }) => {
  switch (chain) {
    case 1: // 'aptos'
    useEffect(()=>{console.log('aptos!!!')},[]);

      const wallets = [new PetraWallet()]
      const { account } = useWallet()
      const clientConfig: ClientConfig = {
        API_KEY: process.env.REACT_APP_APIKEY,
      }

      const config = new AptosConfig({
        fullnode: "fullnode.random.aptoslabs.com",
        network: Network.RANDOMNET,
        clientConfig,
      })

      const aptos = new Aptos(config);

      return(
      <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
        {children}
      </AptosWalletAdapterProvider>
      );
    case 2: // 'evm'
      return <div>{children}</div>
    default:
      return null
  }
}
