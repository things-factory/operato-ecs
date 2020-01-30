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

@Entity('sale_order_details')
@Index('ix_sale_order_detail_0', (sod: SaleOrderDetail) => [sod.domain, sod.saleOrder, sod.product], { unique: true })
export class SaleOrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column({ // FIXME notnull
    nullable: true
  })
  name: string

  @ManyToOne(
    type => SaleOrder,
    saleOrder => saleOrder.details,
    { onDelete: 'CASCADE' }
  )
  saleOrder: SaleOrder

  @ManyToOne(type => Product)
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
