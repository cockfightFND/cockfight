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
import { getUser } from "service";

const Joi = Validator.Joi;

@Controller('')
export class UserController extends KoaController {
    /**
     *
     * @api {get} /user/:address Get user entity
     * @apiName getUser
     * @apiGroup User
     */
    @Get('/user/:address')
    @Validate({
        params: {
            address: Joi.string().description('Address')
        },
        failure: ErrorCodes.INVALID_REQUEST_ERROR
    })
    async getUser(ctx: Context): Promise<void> {
        const address: string = ctx.params.address;
        success(ctx, await getUser(address));
    }
}

