import { CreateDateColumn, UpdateDateColumn, Entity, Index, Column, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { User } from '@things-factory/auth-base'

@Entity()
@Index('ix_step_0', (step: Step) => [step.domain, step.name], { unique: true })
export class Step {
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
