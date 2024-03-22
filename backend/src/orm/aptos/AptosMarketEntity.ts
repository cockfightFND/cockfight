import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('aptos_market')
export class AptosMarketEntity {
    @PrimaryColumn('text')
    time: Date
    
    @Column('int')
    stage: number

    @Column('int')
    totalChickenNum: number

    @Column('int')
    totalEggNum: number

    @Column('int')
    chickenPrice: number

    @Column('int')
    eggPrice: number
}