export default class Lights {
  configs = [
    {
      Type: THREE.PointLight,
      color: 0xffffff,
      intensity: 1,
      position: [-0.5, 0.5, 1],
      debugColor: 0xff0000 // Red
    },
    {
      Type: THREE.PointLight,
      color: 0xffffff,
      intensity: 0.5,
      position: [-0.5, 0, -1],
      debugColor: 0x00ff00 // Green
    },
    {
      Type: THREE.PointLight,
      color: 0xffffff,
      intensity: 0.75,
      position: [0.5, 0.25, 1],
      debugColor: 0x0000ff // Blue
    },
    {
      Type: THREE.AmbientLight,
      color: 0xffffff,
      intensity: 0.2,
      debugColor: 0xff00ff // Magenta
    }
  ]

  lights = []

  constructor ({ scene }) {
    this.scene = scene
    this.configs.forEach(lightConf => {
      const {
        Type,
        position,
        color = 0xffffff,
        intensity = 1
      } = lightConf
      const light = new Type(color)

      light.intensity = intensity
      position && this.positionLight(light, position)

      this.lights.push(light)
      this.scene.addLight(light)
    })
  }

  positionLight (light, position) {
    const [x, y, z] = position
    light.position.set(
      this.scene.width * x,
      this.scene.height * y,
      this.scene.pxDepth * z
    )
  }
}
