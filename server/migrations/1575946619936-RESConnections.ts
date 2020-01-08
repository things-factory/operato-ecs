import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { Connection } from '@things-factory/integration-base'

const connections = [
  {
    id: '682e7eeb-da0b-4481-8b1f-7a4eaf28685d',
    name: 'indi@192.168.1.207',
    description: 'indi-7 robot at 192.168.1.207',
    type: 'indi-robot',
    endpoint: '192.168.1.207:8818',
    params: '',
    active: true,
    status: 0
  },
  {
    id: 'caf4ce85-587b-4a6b-961b-cc680883f1bd',
    name: 'plc@192.168.1.208',
    description: 'mitsubishi plc at 192.168.1.208',
    type: 'mitsubishi-plc',
    endpoint: '192.168.1.208:9987',
    params: '',
    active: true,
    status: 0
  },
  {
    id: '3eb90c98-fdc0-4fee-add0-df79a78467c0',
    name: 'echo-back@localhost',
    description: 'echo-back server at localhost',
    type: 'echo-back',
    endpoint: 'localhost:8124',
    params: '',
    active: true,
    status: 0
  }
]

export class RESConnections1575946619936 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Connection)
    const domainRepository = getRepository(Domain)
    const domain = await domainRepository.findOne({ name: 'SYSTEM' })

    try {
      connections.forEach(async one => {
        await repository.save({ ...one, domain })
      })
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Connection)
    connections.reverse().forEach(async one => {
      let record = await repository.findOne({ id: one.id })
      await repository.remove(record)
    })
  }
}
