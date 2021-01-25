const { assetsURL: themeAssetsURL } = window.theme

console.log(themeAssetsURL)
let assetsURL
if (/localhost:/.test(themeAssetsURL)) {
  assetsURL = themeAssetsURL
} else {
  const urlParts = themeAssetsURL.split('/')
  urlParts.pop()

  assetsURL = urlParts.join('/')
}

export { assetsURL }
