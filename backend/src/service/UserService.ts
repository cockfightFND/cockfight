import UserEntity from "orm/UserEntity";
import { getDB } from "worker/db";
import { APIError, ErrorTypes } from 'lib/error';

export interface GetUserResponse {
  user: UserEntity;
}

export async function getUser(address: string): Promise<GetUserResponse> {
    const [db] = getDB();
    const queryRunner = db.createQueryRunner('slave');
    try {
        const qb = queryRunner.manager
            .createQueryBuilder(UserEntity, 'user')
            .where('user.address = :address', { address });
        const user = await qb.getOne();
        if (!user) {
            throw new APIError(ErrorTypes.NOT_FOUND_ERROR);
        }
        return {
            user
        };
    } finally {
        queryRunner.release();
    }
}