import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export default class UserEntity {
  @PrimaryColumn('text')
  address: string;

  @Column('int')
  chicken_cnt: number;

  @Column('int')
  egg_cnt: number;

  @Column('int')
  balance: number;
}
