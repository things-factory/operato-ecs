import {
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Index,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Domain } from '@things-factory/shell'
import { User } from '@things-factory/auth-base'

import { SaleOrder } from './sale-order'
import { Product } from './product'

@Entity('work_orders')
@Index('ix_work_order_0', (wo: WorkOrder) => [wo.domain, wo.name], { unique: true })
@Index('ix_work_order_1', (wo: WorkOrder) => [wo.domain, wo.saleOrder, wo.product])
export class WorkOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column()
  name: string

  @ManyToOne(type => Domain)
  saleOrder: SaleOrder

  @ManyToOne(type => Domain)
  product: Product

  @Column('float')
  qty: number

  @Column()
  status: string
 
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
