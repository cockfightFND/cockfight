import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('aptos_betting')
export class AptosBettingEntity {
  @PrimaryColumn('text')
  address: string

  @PrimaryColumn('int')
  gameId: number

  @Column('int')
  eggs: number

  @Column('int')
  position: number
  
  @Column('text', { nullable: true})
  merkleRoot: string | null

  @Column('text', { nullable: true, array: true })
  merkleProof: string[] | null

  @Column('int', {nullable: true})
  reward: number | null
}