export const printable = {
  drone: {
    appearance: 'shaded',
    rotation: ['180deg', '360deg', '-180deg'],
    position: (section) => {
      console.log('printable.js', section)
      const { scene } = section.app
      return [0, window.innerHeight * -0.28, scene.depth * 0.25]
    },
    state: {
      float: false,
    }
  }
}