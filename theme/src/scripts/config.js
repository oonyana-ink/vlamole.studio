const { assetsURL: themeAssetsURL } = window.theme

class Config {
  get assetsURL () {
    let assetsURL

    if (/localhost:/.test(themeAssetsURL)) {
      assetsURL = themeAssetsURL
    } else {
      const urlParts = themeAssetsURL.split('/')
      urlParts.pop()
      assetsURL = urlParts.join('/')
    }

    return assetsURL
  }
}

const config = new Config()
export default config
