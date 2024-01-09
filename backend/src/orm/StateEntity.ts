import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity('state')
export class StateEntity {
  @PrimaryColumn('text')
  name: string

  @Column('int')
  gameId: number

  @Column('int')
  prizeAmount: number 
}
