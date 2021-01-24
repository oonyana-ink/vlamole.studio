const { stylesheet } = window.theme
const stylesheetParts = stylesheet.split('/')
stylesheetParts.pop()

export const assetsURL = stylesheetParts.join('/')
