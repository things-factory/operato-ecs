import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { Scenario } from '@things-factory/integration-base'

const scenarios = [
  {
    id: '0202d38d-112f-4144-9705-0524d79e29bd',
    name: 'Robot & PLC Control',
    description: 'Robot & PLC Conntrol',
    active: true,
    status: 0
  },
  {
    id: 'c6f0f8b9-82a7-4a92-82eb-14cc4c3bac48',
    name: 'Test Scenario',
    description: 'Test Scenario',
    active: true,
    status: 0
  }
]

export class RESScenarios1575959384516 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Scenario)
    const domainRepository = getRepository(Domain)
    const domain = await domainRepository.findOne({ name: 'SYSTEM' })

    try {
      scenarios.forEach(async one => {
        await repository.save({ ...one, domain })
      })
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Scenario)
    scenarios.reverse().forEach(async one => {
      let record = await repository.findOne({ id: one.id })
      await repository.remove(record)
    })
  }
}
