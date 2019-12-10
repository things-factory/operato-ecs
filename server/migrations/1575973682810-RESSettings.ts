import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { Setting } from '@things-factory/setting-base'

const settings = [
  {
    id: '473d2806-a0ac-4023-8693-e0367fc35b03',
    name: 'home',
    description: 'home dashboard',
    category: 'board',
    value: 'b980c06c-1336-4f57-a38c-88dba09cba6e'
  }
]

export class RESSettings1575973682810 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Setting)
    const domainRepository = getRepository(Domain)
    const domain = await domainRepository.findOne({ name: 'SYSTEM' })

    try {
      settings.forEach(async one => {
        await repository.save({ ...one, domain })
      })
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Setting)
    settings.reverse().forEach(async one => {
      let record = await repository.findOne({ id: one.id })
      await repository.remove(record)
    })
  }
}
