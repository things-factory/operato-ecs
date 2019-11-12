export interface ConnectionConfig {
  connector: string
  host: string
  port: number
  [propName: string]: any
}

export interface Connector {
  ready(connections: ConnectionConfig[]): Promise<any>
}

export interface Step {
  sequence?: string
  type: string /* task */
  ip?: string /* TODO should be a connection name of params */
  name?: string /* TODO should be one of params for task */
  [propName: string]: any
}

export type TaskHandler = (step: Step, context: any) => void
