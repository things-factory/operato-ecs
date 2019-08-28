import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { Sheet } from '../entities'

const SEED = [
  {
    name: 'Menu 1',
    description: 'Description for Menu 1'
  },
  {
    name: 'Menu 2',
    description: 'Description for Menu 2'
  },
  {
    name: 'Menu 3',
    description: 'Description for Menu 3'
  },
  {
    name: 'Menu 4',
    description: 'Description for Menu 4'
  }
]

export class SeedSheet1566969937707 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Sheet)
    const domainRepository = getRepository(Domain)
    const domain = await domainRepository.findOne({
      name: 'SYSTEM'
    })

    try {
      SEED.forEach(async sheet => {
        await repository.save({
          ...sheet,
          domain
        })
      })
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Sheet)
    SEED.reverse().forEach(async sheet => {
      let record = await repository.findOne({ name: sheet.name })
      await repository.remove(record)
    })
  }
}
