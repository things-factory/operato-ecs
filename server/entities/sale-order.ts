import {
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Index,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Domain } from '@things-factory/shell'
import { User } from '@things-factory/auth-base'
import { SaleOrderDetail } from './sale-order-detail'


@Entity('sale_orders')
@Index('ix_sale_order_0', (saleOrder: SaleOrder) => [saleOrder.domain, saleOrder.name], { unique: true })
export class SaleOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column()
  name: string

  @Column({
    nullable: true
  })
  description: string

  @Column({
    nullable: true
  })
  posNo: string

  @Column('float')
  qty: number

  @Column()
  status: string

  @Column({
    nullable: true
  })
  type: string

  @OneToMany(
    type => SaleOrderDetail,
    saleOrderDetail => saleOrderDetail.saleOrder
  )
  details: SaleOrderDetail[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(type => User, {
    nullable: true
  })
  creator: User

  @ManyToOne(type => User, {
    nullable: true
  })
  updater: User
}
