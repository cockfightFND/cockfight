// import {
//     Account,
//     AccountAddress,
//     Aptos,
//     AptosConfig,
//     Ed25519Account,
//     Ed25519PrivateKey,
//     Network,
//     NetworkToNetworkName,
// } from "@aptos-labs/ts-sdk";

// export const APTOS = '0x1::aptos_coin::AptosCoin'
// export const COCKFIGHT_DEPLOYER = 

// const aptosConfig = new AptosConfig({ network: Network.RANDOMNET });
// const aptos = new Aptos(aptosConfig);
// // const myAccount = Account.fromPrivateKey({ privateKey: new Ed25519PrivateKey(privateKey)});

// export interface TokenPairReserve {
//     block_timestamp_last: string
//     reserve_x: string
//     reserve_y: string
// }

// export interface Coin {
//     resource: string
//     decimal: number
// }


// export async function queryBalance(accountAddress: AccountAddress, coinType: any): Promise<number> {
//     const XAmount = await aptos.getAccountCoinAmount({ accountAddress, coinType });
//     return XAmount
// }

// export async function swap(X: string, Y: string, x_in: number, y_min_out: number) {
//     const transaction = await aptos.transaction.build.simple({
//         sender: myAccount.accountAddress,
//             data: {
//                 function: `${PANCAKE_DEPLOYER}::router::swap_exact_input`,
//                 typeArguments: [X, Y],
//                 functionArguments: [
//                     x_in,
//                     y_min_out,
//                 ],
//             },
//         });
        
//     const response = await aptos.signAndSubmitTransaction({
//         signer: myAccount,
//         transaction,
//     });
    

//     // try {
//     //     await aptos.waitForTransaction({
//     //         transactionHash: response.hash,
//     //     });
//     // } catch(e) {
//     //     console.log(`error!`)
//     // } 

//     return response
// }
    
// export async function getExpectedYAmount(X: string, Y: string, amount_in: number): Promise<number> {
//     const resource = await aptos.getAccountResource<TokenPairReserve>({
//         accountAddress: PANCAKE_DEPLOYER,
//         resourceType: `${PANCAKE_DEPLOYER}::swap::TokenPairReserve<${X}, ${Y}>`,
//     });
//     const reserve_x = parseInt(resource.reserve_x)
//     const reserve_y = parseInt(resource.reserve_y)
//     const amount_in_with_fee = amount_in * (1 - PANCAKE_COMMISSION)
//     const expectedYAmount = (amount_in_with_fee * reserve_x) / (reserve_y + amount_in_with_fee ) 
    
    
//     return expectedYAmount
// }

// export async  function transferCoin(to: string, coinType: string, amount: number) {
//     const transaction = await aptos.transaction.build.simple({
//         sender: myAccount.accountAddress,
//         data: {
//             function: `0x1::coin::transfer`,
//             typeArguments: [coinType],
//             functionArguments: [
//                 to,
//                 amount,
//             ],
//         },
//     });
//     const response = await aptos.signAndSubmitTransaction({
//         signer: myAccount,
//         transaction,
//     });
//     return response
// }