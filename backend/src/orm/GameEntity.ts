import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity('game')
export class GameEntity {
  @PrimaryColumn('int')
  gameId: number
  
  @Column('int')
  positionNum: number 

  @Column('int', { nullable: true })
  winnerPosition: number

  @Column('int')
  prizeAmount: number 
}