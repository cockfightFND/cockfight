import StageEntity from "orm/StageEntity";
import { getDB } from "worker/db";
import { APIError, ErrorTypes } from 'lib/error';

export interface GetStageResponse {
  stage: StageEntity;
}

export async function getStage(stageNumber: number): Promise<GetStageResponse> {
    const [db] = getDB();
    const queryRunner = db.createQueryRunner('slave');
    try {
        const qb = queryRunner.manager
            .createQueryBuilder(StageEntity, 'stage')
            .where('stage.stage = :stage', { stageNumber });
        const stage = await qb.getOne();
        if (!stage) {
            throw new APIError(ErrorTypes.NOT_FOUND_ERROR);
        }
        return {
            stage
        };
    } finally {
        queryRunner.release();
    }
}