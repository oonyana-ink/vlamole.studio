const $gridOverlay = document.querySelector('.grid-overlay')
const renderOverlay = function () {
  $gridOverlay.classList.toggle('show', showOverlay)
}

let showOverlay = false

document.addEventListener('keydown', function (ev) {
  showOverlay = ev.code === 'Backquote'
  renderOverlay()
})

document.addEventListener('keyup', function (ev) {
  showOverlay = ev.code === 'Backquote' ? false : showOverlay
  renderOverlay()
})
