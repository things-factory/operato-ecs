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
import { Scenario } from '@things-factory/integration-base'
import { Product } from './product'

@Entity('material_scenarios')
@Index('ix_material_scenario_0', (materialScenario: MaterialScenario) => [materialScenario.domain, materialScenario.product, materialScenario.scenario], { unique: true })
export class MaterialScenario {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @ManyToOne(type => Product)
  product: Product

  @ManyToOne(type => Scenario)
  scenario: Scenario

  @Column({
    nullable: true
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
  