// view functions for vip

import { BCS } from '@initia/initia.js'
import { config } from 'config'
import { CONTRACT_BECH_ADDRESS, CONTRACT_HEX_ADDRESS, CONTRACT_MODULE_NAME } from './constants'

export const bcs = BCS.getInstance()

export interface ModuleResponse {
  total_chicken: string
  chicken_price: string
  egg_price: string
  chickens: string
  eggs: string
  cock_fights: string
}

export async function getModuleStore(
): Promise<ModuleResponse> {
  const res = await config.l1lcd.move.viewFunction<any>(
    CONTRACT_HEX_ADDRESS,
    CONTRACT_MODULE_NAME,
    'get_module_store',
    [],
    []
  )
  console.log(res)
  return res
}


// export async function getTotalChickens(): Promise<number> {
//   const chickens = await config.l1lcd.move.viewFunction<string>(
//     CONTRACT_HEX_ADDRESS,
//     CONTRACT_MODULE_NAME,
//     'get_total_chickens',
//     [],
//     []
//   )
//   return parseInt(chickens)
// }

// export async function getTotalEggs(): Promise<number> {
//   // TODO: fix this
//   const chickens = await config.l1lcd.move.viewFunction<string>(
//     CONTRACT_HEX_ADDRESS,
//     CONTRACT_MODULE_NAME,
//     'get_total_chickens',
//     [],
//     []
//   )
//   const eggs = parseInt(chickens) * 10
//   return eggs
// }

// export async function getChickenPrice(): Promise<number> {
//   const chickenPrice = await config.l1lcd.move.viewFunction<string>(
//     CONTRACT_HEX_ADDRESS,
//     CONTRACT_MODULE_NAME,
//     'get_chicken_price',
//     [],
//     []
//   )
//   return parseInt(chickenPrice)
// }

// export async function getEggPrice(): Promise<number> {
//   const eggPrice = await config.l1lcd.move.viewFunction<string>(
//     CONTRACT_HEX_ADDRESS,
//     CONTRACT_MODULE_NAME,
//     'get_egg_price',
//     [],
//     []
//   )
//   return parseInt(eggPrice)
// }
