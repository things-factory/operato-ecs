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
  
@Entity('products')
@Index('ix_product_0', (product: Product) => [product.domain, product.code], { unique: true })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column()
  code: string

  @Column()
  name: string

  @Column({
    nullable: true
  })
  description: string

  @Column()
  type: string  // R(robot), H(Human)

  @Column({
    nullable: true
  })
  active: boolean

  @Column({
    nullable: true
  })
  uom: string

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
  