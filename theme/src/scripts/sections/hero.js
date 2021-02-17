export const hero = {
  els: {
    backgroundVideo: '.background-video'
  },

  onEnter (section) {
    const {
      $els
    } = section

    $els.backgroundVideo.play()
  },

  onLeave (section) {
    const {
      $els
    } = section

    $els.backgroundVideo.pause()
  }
}
