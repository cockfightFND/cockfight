import { Ed25519Account, MoveStructId } from "@aptos-labs/ts-sdk";
import { aptos } from "./chain";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";


// export async function transaction(
//     account: Ed25519Account,
//     data: InputTransactionData,
//     typeArguments: string[],
//     functionArguments: string[],
// ) {
//     const transaction = await aptos.transaction.build.simple({
//         sender: account.accountAddress,
//             data: {
//                 function: functionName,
//                 typeArguments,
//                 functionArguments,
//             },
//     });
    
//     const response = await aptos.signAndSubmitTransaction({
//         signer: account,
//         transaction,
//     });
    
//     return response
// }
