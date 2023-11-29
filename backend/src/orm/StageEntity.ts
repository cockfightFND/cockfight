import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('stage')
export default class StageEntity {
  @PrimaryColumn('int')
  stage: number

  @Column('int')
  total_stake: number;

  @Column('int')
  reward: number;
}
