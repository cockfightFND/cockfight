import { KoaController } from 'koa-joi-controllers'
import { BettingController } from './BettingController'
import { SubmissionController } from './SubmissionController'
import { FaucetController } from './FaucetController'
import { MarketController } from './MarketController'
import { UserController } from './UserController'
import { RewardController } from './RewardController'
import { GameController } from './GameController'


const controllers = [
  BettingController,
  SubmissionController,
  FaucetController,
  MarketController,
  UserController,
  RewardController,
  GameController
]
  .map((prototype) => {
    const controller = new prototype()
    return controller
  })
  .filter(Boolean) as KoaController[]

export default controllers
