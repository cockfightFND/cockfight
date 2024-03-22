import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity('aptos_game')
export class AptosGameEntity {
  @PrimaryColumn('int')
  gameId: number
  
  @Column('int')
  positionNum: number 

  @Column('int', { nullable: true })
  winnerPosition: number | null

  @Column()
  endTime: Date

  @Column()
  isEnded: boolean
}