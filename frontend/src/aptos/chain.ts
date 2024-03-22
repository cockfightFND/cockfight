import { Aptos, AptosConfig, ClientConfig, Network } from "@aptos-labs/ts-sdk";

export const clientConfig: ClientConfig = {
    API_KEY: process.env.REACT_APP_APIKEY,
  };

  export const config = new AptosConfig({
    fullnode: "fullnode.random.aptoslabs.com",
    network: Network.RANDOMNET,
    clientConfig,
  });

export const aptos = new Aptos(config)