import { Coins, MsgSend } from "@initia/initia.js"
import { contract } from "lib/wallet"

interface GetTokensParam {
    address: string
}
  
export async function getTokens(
    req: GetTokensParam
) {
    try { 
        const token = new Coins({ uinit: 100_000_000 })
        const msg = new MsgSend(
            contract.key.accAddress,
            req.address,
            { uinit: 100_000_000 }
        )
        await contract.transaction([msg])
        return token
    } catch (err) {
        console.log(err)
    }
}