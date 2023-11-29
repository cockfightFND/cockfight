import StateEntity from "orm/StateEntity";
import { getDB } from "worker/db";
import { APIError, ErrorTypes } from 'lib/error';

export interface GetStateResponse {
  state: StateEntity;
}

export async function getState(timestamp: Date): Promise<GetStateResponse> {
    const [db] = getDB();
    const queryRunner = db.createQueryRunner('slave');
    try {
        const qb = queryRunner.manager
            .createQueryBuilder(StateEntity, 'state')
            .where('state.timestamp = :timestamp', { timestamp });
        const state = await qb.getOne();
        if (!state) {
            throw new APIError(ErrorTypes.NOT_FOUND_ERROR);
        }
        return {
            state
        };
    } finally {
        queryRunner.release();
    }
}