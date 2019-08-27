import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { Board } from '@things-factory/board-service'

export class SeedBoard1566871763153 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Board)
    const domainRepository = getRepository(Domain)
    const domain = await domainRepository.findOne({ name: 'SYSTEM' })

    try {
      ;[1, 2, 3, 4, 5].forEach(async id => {
        await repository.save({
          model: `{"height": 1000, "width": 1000}`,
          thumbnail: '',
          domain,
          name: String(id),
          id: String(id)
        })
      })
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Board)
    ;[1, 2, 3, 4, 5].reverse().forEach(async id => {
      let record = await repository.findOne({ id: String(id) })
      await repository.remove(record)
    })
  }
}
