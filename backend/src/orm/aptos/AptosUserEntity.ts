import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('aptos_user')
export class AptosUserEntity {
    @PrimaryColumn('text')
    address: string
    
    @Column('int')
    chicken: number

    @Column('int')
    egg: number
}