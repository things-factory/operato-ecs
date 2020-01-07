import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { Step } from '@things-factory/integration-base'

const steps = [
  {
    id: '925073bf-123f-48c2-a62b-37c2b0b7e28a',
    name: 'robot move #1',
    description: 'robot move #1',
    scenario: '0202d38d-112f-4144-9705-0524d79e29bd',
    sequence: 0,
    task: 'robot_move',
    connection: 'indi@192.168.1.207',
    params: '{\n  "position": "test1"\n}'
  },
  {
    id: '50522ccd-6f4d-4a96-9ecb-531e96b837ab',
    name: 'plc on',
    description: 'plc on',
    scenario: '0202d38d-112f-4144-9705-0524d79e29bd',
    sequence: 1,
    task: 'onoff',
    connection: 'plc@192.168.1.208',
    params: '{\n  "plcAddress": "M0",\n  "value": 1\n}'
  },
  {
    id: '9fd70ed8-4596-4fc5-9b39-2ecdc8e7ddbf',
    name: 'plc watching',
    description: 'plc watching',
    scenario: '0202d38d-112f-4144-9705-0524d79e29bd',
    sequence: 2,
    task: 'watching',
    connection: 'plc@192.168.1.208',
    params: '{\n  "plcAddress": "Y3",\n  "value": 1\n}'
  },
  {
    id: 'fa5ea3fc-7cb8-4d7f-a186-f0c03a391eab',
    name: 'plc off',
    description: 'plc off',
    scenario: '0202d38d-112f-4144-9705-0524d79e29bd',
    sequence: 3,
    task: 'onoff',
    connection: 'plc@192.168.1.208',
    params: '{\n  "plcAddress": "M0",\n  "value": 0\n}'
  },
  {
    id: 'fe6e0c77-60f6-454f-8d40-5cc0eeb27049',
    name: 'robot move #2',
    description: 'robot move #2',
    scenario: '0202d38d-112f-4144-9705-0524d79e29bd',
    sequence: 4,
    task: 'robot_move',
    connection: 'indi@192.168.1.207',
    params: '{\n  "position": "test2"\n}'
  },
  {
    id: 'b8df0866-d5d5-4e22-a2fe-6e6503f62e9d',
    name: 'robot move #3',
    description: 'robot move #3',
    scenario: '0202d38d-112f-4144-9705-0524d79e29bd',
    sequence: 5,
    task: 'robot_move',
    connection: 'indi@192.168.1.207',
    params: '{\n  "position": "test3"\n}'
  },
  {
    id: 'ed6f2a3e-40aa-4303-ac7a-31634c865c41',
    name: 'robot move #4',
    description: 'robot move #4',
    scenario: '0202d38d-112f-4144-9705-0524d79e29bd',
    sequence: 6,
    task: 'robot_move',
    connection: 'indi@192.168.1.207',
    params: '{\n  "position": "test4"\n}'
  },
  {
    id: '3d724a8c-2bec-4d0a-88d4-76016661ebec',
    name: 'robot move #5',
    description: 'robot move #5',
    scenario: '0202d38d-112f-4144-9705-0524d79e29bd',
    sequence: 7,
    task: 'robot_move',
    connection: 'indi@192.168.1.207',
    params: '{\n  "position": "test5"\n}'
  },
  {
    id: 'd5a05ccf-8191-487f-b71d-2e9fc73ee06a',
    name: 'sleep',
    description: 'sleep',
    scenario: 'c6f0f8b9-82a7-4a92-82eb-14cc4c3bac48',
    sequence: 0,
    task: 'sleep',
    connection: null,
    params: '{\n  "duration": 1000\n}'
  },
  {
    id: '0aa6c8ad-466b-4296-bc5b-864c702863ce',
    name: 'log',
    description: 'log',
    scenario: 'c6f0f8b9-82a7-4a92-82eb-14cc4c3bac48',
    sequence: 1,
    task: 'log',
    connection: null,
    params: '{\n  "message": "Scenario Start"\n}'
  },
  {
    id: 'e80c1b83-512e-4163-8b18-3bb96b0b5c99',
    name: 'sleep',
    description: 'sleep',
    scenario: 'c6f0f8b9-82a7-4a92-82eb-14cc4c3bac48',
    sequence: 2,
    task: 'sleep',
    connection: null,
    params: '{\n  "duration": 1000\n}'
  },
  {
    id: 'a1753d4c-294c-474d-a0fa-3e4692cb4116',
    name: 'echo-send',
    description: 'echo-send',
    scenario: 'c6f0f8b9-82a7-4a92-82eb-14cc4c3bac48',
    sequence: 3,
    task: 'echo-send',
    connection: 'echo-back@localhost',
    params: '{\n  "message": "echo 1"\n}'
  },
  {
    id: '90857ce3-58e4-4fc8-9d38-e3a596f332dc',
    name: 'sleep',
    description: 'sleep',
    scenario: 'c6f0f8b9-82a7-4a92-82eb-14cc4c3bac48',
    sequence: 4,
    task: 'sleep',
    connection: null,
    params: '{\n  "duration": 1000\n}'
  },
  {
    id: '9c87c70c-b9a3-4e82-b87c-2d53598aee56',
    name: 'echo-receive',
    description: 'echo-receive',
    scenario: 'c6f0f8b9-82a7-4a92-82eb-14cc4c3bac48',
    sequence: 5,
    task: 'echo-receive',
    connection: 'echo-back@localhost',
    params: null
  },
  {
    id: '8cd25a0a-c815-45a1-bf7f-97860dabe55f',
    name: 'sleep',
    description: 'sleep',
    scenario: 'c6f0f8b9-82a7-4a92-82eb-14cc4c3bac48',
    sequence: 6,
    task: 'sleep',
    connection: null,
    params: '{\n  "duration": 1000\n}'
  },
  {
    id: '94c4afdf-bb79-44c6-8c58-b872676e227b',
    name: 'echo-send',
    description: 'echo-send',
    scenario: 'c6f0f8b9-82a7-4a92-82eb-14cc4c3bac48',
    sequence: 7,
    task: 'echo-send',
    connection: 'echo-back@localhost',
    params: '{\n  "message": "echo 2"\n}'
  },
  {
    id: 'ec2f5d76-c1a6-467e-98b8-f8ee60af86e7',
    name: 'sleep',
    description: 'sleep',
    scenario: 'c6f0f8b9-82a7-4a92-82eb-14cc4c3bac48',
    sequence: 8,
    task: 'sleep',
    connection: null,
    params: '{\n  "duration": 1000\n}'
  },
  {
    id: 'fc332eab-99cb-4b6b-b883-3da70b36ac0d',
    name: 'echo-receive',
    description: 'echo-receive',
    scenario: 'c6f0f8b9-82a7-4a92-82eb-14cc4c3bac48',
    sequence: 9,
    task: 'echo-receive',
    connection: 'echo-back@localhost',
    params: null
  },
  {
    id: '8b1ba43e-4cdd-48e2-a27b-9fd419990106',
    name: 'sleep',
    description: 'sleep',
    scenario: 'c6f0f8b9-82a7-4a92-82eb-14cc4c3bac48',
    sequence: 10,
    task: 'sleep',
    connection: null,
    params: '{\n  "duration": 1000\n}'
  },
  {
    id: 'e0c20603-fa18-4f9b-b2ca-04e41829db19',
    name: 'publish',
    description: 'publish',
    scenario: 'c6f0f8b9-82a7-4a92-82eb-14cc4c3bac48',
    sequence: 11,
    task: 'publish',
    connection: null,
    params: '{\n  "message": "Scenario End"\n}'
  },
  {
    id: 'dba4b69b-d242-41fb-b63f-5481ab751724',
    name: 'sleep',
    description: 'sleep',
    scenario: 'c6f0f8b9-82a7-4a92-82eb-14cc4c3bac48',
    sequence: 12,
    task: 'sleep',
    connection: null,
    params: '{\n  "duration": 1000\n}'
  }
]

export class RESSteps1575959880964 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Step)
    const domainRepository = getRepository(Domain)
    const domain = await domainRepository.findOne({ name: 'SYSTEM' })

    try {
      steps.forEach(async one => {
        await repository.save({ ...one, domain, scenario: { id: one.scenario } })
      })
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Step)
    steps.reverse().forEach(async one => {
      let record = await repository.findOne({ id: one.id })
      await repository.remove(record)
    })
  }
}
