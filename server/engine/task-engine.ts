// var Queue = require('bull')

// enum STATE {
//   CREATED,
//   READY,
//   STARTED,
//   PAUSED,
//   STOPPED
// }

// class Task {}

// class TaskQueue {
//   queue: Queue
//   state: STATE
//   progress: number
//   tasks: Task[]

//   constructor(name, tasks) {
//     this.queue = new Queue(name)
//     this.state = STATE.CREATED
//     this.progress = 0
//     this.tasks = tasks

//     this.ready()
//   }

//   ready() {
//     if (this.state == STATE.STOPPED || this.state == STATE.CREATED) {
//       this.tasks.forEach(task => this.queue.add(task))
//       this.state = STATE.READY
//     }
//   }

//   start() {
//     switch (this.state) {
//       case STATE.STARTED:
//         return
//       case STATE.PAUSED:
//         this.resume()
//         return
//       case STATE.STOPPED:
//       case STATE.READY:
//       default:
//     }

//     this.queue.process(this.process)
//   }

//   pause() {}

//   resume() {}

//   stop() {
//     this.queue.this.state = STATE.STOPPED
//   }

//   process(task) {
//     task.progress(0)
//   }
// }

export default class TaskEngine {
  static start() {}

  static stop() {}

  static on() {}
}
