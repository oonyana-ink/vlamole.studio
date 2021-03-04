export default class Cameras {
  perspectiveCamera = null
  orthographicCamera = null

  configs = {
    perspectiveCamera: {
      fov: 40,
      near: 1,
      far: 2000
    }
  }

  constructor ({ scene }) {
    const { near, far, fov } = this
    const { height, width } = scene
    this.scene = scene
    this.perspectiveCamera = new THREE.PerspectiveCamera(fov, width / height, near, far)
    this.orthographicCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, near, far)
  }

  get activeCamera () {
    return this.perspectiveCamera
  }

  get fov () {
    return this.activeCamera ? this.activeCamera.fov : this.configs.perspectiveCamera.fov
  }
}