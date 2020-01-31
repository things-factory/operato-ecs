// SO: INIT(receive), STARTED(split), FINISHED(finish), CANCELED(cancel)
// SOD: CANCELED
// WO: INIT(split), STARTED(start scenario), PAUSED(pause), FINISHED(finish), CANCELED(cancel)

export enum ORDER_STATE {
  INIT,
  // READY,
  STARTED,
  PAUSED,
  // STOPPED,
  CANCELED,
  FINISHED
}
