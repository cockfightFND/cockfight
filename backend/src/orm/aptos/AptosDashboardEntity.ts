import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('aptos_dashboard')
export class AptosDashboardEntity {
    @PrimaryColumn('text')
    time: string
    
    @Column('float')
    apy: number

    @Column('int')
    tvl: number
}