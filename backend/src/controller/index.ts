import { KoaController } from 'koa-joi-controllers';
import { StageController } from './StageController';
import { StateController } from './StateController';
import { UserController } from './UserController';

export const executorController = [
  StageController,
  StateController,
  UserController
].map((prototype) => new prototype()) as KoaController[];