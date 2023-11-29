import { Context } from 'koa';
import {
  KoaController,
  Validate,
  Get,
  Controller,
  Validator
} from 'koa-joi-controllers';
import { ErrorCodes } from 'lib/error';
import { success } from 'lib/response';
import { getState } from 'service';

const Joi = Validator.Joi;

@Controller('')
export class StateController extends KoaController {
  /**
   *
   * @api {get} /state/:timestamp Get state entity
   * @apiName getState
   * @apiGroup Tx
   */
  @Get('/state/:timestamp')
  @Validate({
    params: {
      timestamp: Joi.date().description('Timestamp')
    },
    failure: ErrorCodes.INVALID_REQUEST_ERROR
  })
  async getState(ctx: Context): Promise<void> {
    const timestamp: Date =new Date(ctx.params.timestamp as string);
    success(ctx, await getState(timestamp));
  }
}
