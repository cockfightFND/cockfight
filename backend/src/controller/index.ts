import { KoaController } from 'koa-joi-controllers'
import { BettingController } from './BettingController'
import { SubmissionController } from './SubmissionController'


const controllers = [
  BettingController,
  SubmissionController,
]
  .map((prototype) => {
    const controller = new prototype()
    return controller
  })
  .filter(Boolean) as KoaController[]

export default controllers
