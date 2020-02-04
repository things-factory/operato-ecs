// SO: INIT(receive), STARTED(split), FINISHED(finish), CANCELED(cancel)
// SOD: 
// WO: INIT(split), STARTED(start scenario), PAUSED(pause), FINISHED(finish), STOPED(WO CANCEL), CANCELED(cancel)

export enum ORDER_STATE {
  INIT,
  // READY,
  STARTED,
  PAUSED,
  // STOPPED,
  CANCELED,
  FINISHED
}
