import { Context } from 'koa'
import { KoaController, Post, Controller } from 'koa-joi-controllers'
import { routeConfig } from 'koa-swagger-decorator'
import { success } from 'lib/response'
import { postSubmission } from 'service/SubmissionService'

@Controller('')
export class SubmissionController extends KoaController {
  @routeConfig({
    method: 'post',
    path: '/submission',
    summary: 'Do submission',
    description: 'Do submission',
    tags: ['Submission'],
    operationId: 'postSubmission',
    requestBody: {
      description: 'post submission',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              game_id: {
                type: 'number',
                description: 'The id of the game'
              },
              winner_position: {
                type: 'number',
                description: 'The position of the winner'
              },
            },
            required: ['game_id', 'winner_position']
          }
        },
      }
    }
  })
  @Post('/submission')
  async postSubmission(ctx: Context): Promise<void> {
    success(ctx, await postSubmission(ctx.request.body as any))
  }
}