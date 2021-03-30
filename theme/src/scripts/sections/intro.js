import grid from '../layout/grid'

export const intro = {
  drone: {
    appearance: 'shaded',
    position: () => [grid.columnsWidth(-2), window.innerHeight * -0.2, 0],
    rotation: ['-30deg', '220deg', '10deg']
  }
  // keyframes: {
  //   '.title': {
  //     '0%': {
  //       translateY: 0
  //     },
  //     '100%': {
  //       translateY: 25
  //     }
  //   }
  // }
}
