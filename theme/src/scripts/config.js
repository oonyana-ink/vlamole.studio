const { assetsURL: themeAssetsURL } = window.theme

class Config {
  get assetsURL () {
    let assetsURL

    if (/local/.test(window.location.host)) {
      assetsURL = `//${window.location.host}/assets`
    } else {
      const urlParts = themeAssetsURL.split('/')
      urlParts.pop()
      assetsURL = urlParts.join('/')
    }
    console.log({ assetsURL })
    return assetsURL
  }
}

const config = new Config()
export default config
