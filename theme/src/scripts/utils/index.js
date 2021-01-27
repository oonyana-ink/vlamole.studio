import * as THREE from 'three'

const utils = {
  findScreenDepth (camera, renderer) {
    const { near, far } = camera
    const rendererDimensions = new THREE.Vector2()

    renderer.getDrawingBufferSize(rendererDimensions)

    const cssViewHeight = rendererDimensions.y / renderer.getPixelRatio()
    const threshold = 0.0001

    return _findScreenDepth(near, far)

    function _findScreenDepth (near, far) {
      const midpoint = (far - near) / 2 + near
      const midpointHeight = utils.visibleHeightAtZDepth(-midpoint, camera)
      const heightDiff = Math.abs((cssViewHeight / midpointHeight) - 1)

      if (heightDiff <= threshold) {
        return midpoint
      }

      if (cssViewHeight < midpointHeight) {
        return _findScreenDepth(near, midpoint)
      } else if (cssViewHeight > midpointHeight) {
        return _findScreenDepth(midpoint, far)
      } else if (midpointHeight === cssViewHeight) { // almost never happens
        return midpoint
      }
    }
  },

  visibleHeightAtZDepth (depth, camera) {
    const vFOV = camera.fov * Math.PI / 180
    return 2 * Math.tan(vFOV / 2) * Math.abs(depth)
  }
}

export default utils
