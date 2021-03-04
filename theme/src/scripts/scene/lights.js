export default class Lights {
  configs = [
    {
      Type: THREE.PointLight,
      color: 0xffffff,
      intensity: 0.7,
      position: ({ canvasWidth, canvasHeight, canvasDepth }) => [canvasWidth * 0.5, canvasHeight * 1, canvasDepth],
      debugColor: 0xff0000 // Red
    },
    {
      Type: THREE.PointLight,
      color: 0xffffff,
      intensity: 0.5,
      position: ({ canvasHeight, canvasDepth }) => [0, -canvasHeight, -canvasDepth * 0.5],
      debugColor: 0x00ff00 // Green
    },
    {
      Type: THREE.PointLight,
      color: 0xffffff,
      intensity: 0.5,
      position: ({ canvasWidth, canvasHeight, canvasDepth }) => [-canvasDepth, -canvasHeight * 0, canvasDepth * 0.5],
      debugColor: 0x0000ff // Blue
    },
    {
      Type: THREE.AmbientLight,
      color: 0xffffff,
      intensity: 0.2,
      debugColor: 0xff00ff // Magenta
    }
  ]

  constructor () {

  }
}