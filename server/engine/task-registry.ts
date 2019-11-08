export default class TaskRegistry {
  static handlers = {}

  static getTaskHandler(type) {
    return TaskRegistry.handlers[type]
  }

  static registerTaskHandler(type, handler) {
    TaskRegistry.handlers[type] = handler
  }

  static unregisterTaskHandler(type) {
    delete TaskRegistry.handlers[type]
  }
}
