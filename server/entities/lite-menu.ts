import {
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Index,
  Column,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Domain } from '@things-factory/shell'
import { User } from '@things-factory/auth-base'

@Entity('liteMenus')
@Index('ix_lite_menu_0', (liteMenu: LiteMenu) => [liteMenu.domain, liteMenu.name], { unique: true })
@Index('ix_lite_menu_1', (liteMenu: LiteMenu) => [liteMenu.domain, liteMenu.rank], { unique: true })
export class LiteMenu {
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
  rank: number

  @Column({
    nullable: true
  })
  type: string

  @Column({
    nullable: true
  })
  value: string

  @Column({
    nullable: true,
    default: false
  })
  active: boolean

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
