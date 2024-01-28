import { Context } from 'koa'
import { KoaController, Get, Controller } from 'koa-joi-controllers'
import { routeConfig, z } from 'koa-swagger-decorator'
import { ErrorTypes } from 'lib/error'
import { success, error } from 'lib/response'
import { getMarketList } from 'service/MarketService'

@Controller('')
export class MarketController extends KoaController {
  @routeConfig({
    method: 'get',
    path: '/market',
    summary: 'Get market data',
    tags: ['Market'],
    operationId: 'getMarket',
    request: {
      query: z.object({
        time: z.string().optional(),
      }),
    },
  })
  @Get('/market')
  async getMarketList(ctx: Context): Promise<void> {
    const markets = await getMarketList(ctx.query as any)
    if (markets) success(ctx, markets)
    else error(ctx, ErrorTypes.NOT_FOUND_ERROR)
  }
}