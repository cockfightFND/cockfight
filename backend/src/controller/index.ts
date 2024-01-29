import { KoaController } from 'koa-joi-controllers'
import { BettingController } from './BettingController'
import { SubmissionController } from './SubmissionController'
import { FaucetController } from './FaucetController'
import { MarketController } from './MarketController'


const controllers = [
  BettingController,
  SubmissionController,
  FaucetController,
  MarketController,
]
  .map((prototype) => {
    const controller = new prototype()
    return controller
  })
  .filter(Boolean) as KoaController[]

export default controllers
