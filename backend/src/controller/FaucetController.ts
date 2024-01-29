import { Context } from 'koa'
import { KoaController, Controller, Post } from 'koa-joi-controllers'
import { ErrorTypes } from 'lib/error'
import { success, error } from 'lib/response'
import { getTokens } from 'service'

@Controller('')
export class FaucetController extends KoaController {
  @Post('/claim')
  async getTokens(ctx: Context): Promise<void> {
    const token = await getTokens(ctx.request.body as any)
    if (token) success(ctx, token)
    else error(ctx, ErrorTypes.API_ERROR)
  }
}