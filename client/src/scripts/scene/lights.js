export default class Lights {
  configs = [
    {
      Type: THREE.PointLight,
      color: 0xffffff,
      intensity: 0.65,
      position: [0, 1, -0],
      debugColor: 0xff0000 // Red
    },
    {
      Type: THREE.PointLight,
      color: 0xffffff,
      intensity: 0.35,
      position: [-0.5, -0.5, -0.5],
      debugColor: 0x00ff00 // Green
    },
    {
      Type: THREE.PointLight,
      color: 0xffffff,
      intensity: 0.6,
      position: [-0.15, 0, 1],
      debugColor: 0x0000ff // Blue
    },
    {
      Type: THREE.AmbientLight,
      color: 0xffffff,
      intensity: 0.3,
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
