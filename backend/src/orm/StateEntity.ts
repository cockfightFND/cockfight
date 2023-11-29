import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('state')
export default class StateEntity {
  @PrimaryColumn('timestamp')
  time: Date

  @Column('int')
  stage: number;

  @Column('int')
  chicken_price: number;

  @Column('int')
  egg_price: number;

  @Column('int')
  total_chicken_cnt: number;

  @Column('int')
  total_egg_cnt: number;

  @Column('int')
  total_volume_locked: number;

  @Column('int')
  total_user_cnt: number;
}
