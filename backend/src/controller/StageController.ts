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
import { getStage } from 'service';

const Joi = Validator.Joi;

@Controller('')
export class StageController extends KoaController {
  /**
   *
   * @api {get} /state/:stage Get state entity
   * @apiName getState
   * @apiGroup Tx
   */
  @Get('/state/:stage')
  @Validate({
    params: {
      stage: Joi.number().description('Stage')
    },
    failure: ErrorCodes.INVALID_REQUEST_ERROR
  })
  async getState(ctx: Context): Promise<void> {
    const stage: number = parseInt(ctx.params.stage);
    success(ctx, await getStage(stage));
  }
}
