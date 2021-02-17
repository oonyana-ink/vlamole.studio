export default class SceneProxy {
  constructor (opts) {
    const {
      worker
    } = opts

    this.worker = worker
  }

  set (opts) {
    this.worker.postMessage({
      cmd: 'set',
      payload: opts
    })
  }
}
