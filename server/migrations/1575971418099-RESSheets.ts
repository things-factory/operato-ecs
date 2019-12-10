import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { Sheet } from '../entities'

const sheets = [
  {
    id: 'cef38b97-8e48-4e16-bac7-9239f6398a16',
    name: '평택2',
    description: 'Description for Menu 1',
    active: true,
    board: '4389948f-9086-43cf-8d9a-75059017b88f'
  },
  {
    id: '3cbf66da-a245-4311-b777-f4d6aebb4fb6',
    name: '평택1',
    description: 'Description for Menu 2',
    active: false,
    board: '655cf6be-5414-4ec3-9c28-fd4f4e3bebd8'
  },
  {
    id: 'd5418591-f934-4024-ad52-f8ec8bac2e0b',
    name: '주문화면',
    description: 'Description for Menu 3',
    active: false,
    board: null
  },
  {
    id: '2aeeefc4-cf04-472d-aa1b-a84c6d312029',
    name: '볼트체결기',
    description: 'Description for Menu 4',
    active: false,
    board: '1a727716-8b49-4449-8477-32f6d6c00890'
  },
  {
    id: '067f69b8-e36b-4807-87f9-1497fcd09537',
    name: '싱가폴',
    description: null,
    active: false,
    board: 'aee6496c-d5b5-476a-9b14-f0b448b769fe'
  },
  {
    id: 'cfbff5d8-0a9a-49d6-a961-23e6d2efd040',
    name: 'Subscription',
    description: null,
    active: false,
    board: 'c47b87d5-03be-468f-8ba0-52e73eb7c413'
  },
  {
    id: '6738fc9a-8666-473e-95ab-75044a6645cd',
    name: 'LSA 이중사출',
    description: 'LSA',
    active: true,
    board: 'f78edea6-0762-4246-87a3-cafcc8e8ee4a'
  }
]

export class RESSheets1575971418099 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Sheet)
    const domainRepository = getRepository(Domain)
    const domain = await domainRepository.findOne({ name: 'SYSTEM' })

    try {
      sheets.forEach(async one => {
        await repository.save({ ...one, domain, board: { id: one.board } })
      })
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Sheet)
    sheets.reverse().forEach(async one => {
      let record = await repository.findOne({ id: one.id })
      await repository.remove(record)
    })
  }
}
