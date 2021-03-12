/* global THREE */
import config from '../config'

export default class Loader {
  assetsURL = config.assetsURL

  constructor () {
    this.gltfLoader = new THREE.GLTFLoader()
    this.dracoLoader = new THREE.DRACOLoader()
    this.dracoLoader.setDecoderPath(`${this.assetsURL}/`)
    this.gltfLoader.setDRACOLoader(this.dracoLoader)
  }

  loadModel (filename) {
    console.log('Loader:loadModel', filename)
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        `${this.assetsURL}/${filename}`,
        (gltf) => resolve(gltf),
        (xhr) => console.log('Loader:loadModel', filename, '::', (xhr.loaded / xhr.total * 100) + '% loaded'),
        (error) => reject(error)
      )
    })
  }
}
