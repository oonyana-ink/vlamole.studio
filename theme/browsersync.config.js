
/* eslint-disable */

/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */

const fs = require('fs');

const THEME_ID_FILE = '/themeify/.data/theme_id';
const STATE = {
  themeId: null
};

module.exports = {
  "ui": {
      "port": 8789
  },
  "files": "/themeify/.data/theme_notify",
  "watchEvents": [
      "change"
  ],
  "watch": false,
  "ignore": [],
  "single": false,
  "watchOptions": {
      "ignoreInitial": true
  },
  "server": false,
  "proxy": {
      "target": "https://vlamole-dev.myshopify.com",
      "proxyReq": function (proxyReq) {

        const [path, queryString] = proxyReq.path.split('?');
        const queryParams = {};
        const themeId = fs.readFileSync(THEME_ID_FILE, 'utf8');

        if (queryString) {
          queryString.split('&').map((param) => {
            const [key, value] = param.split('=');
            queryParams[key] = value;
          });
        }

        if (themeId && themeId !== STATE.themeId) {
          console.log(themeId)
          queryParams.preview_theme_id = themeId;
          STATE.themeId = themeId;
        }

        const queryParamString =  Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join('&');

        if (!!queryParamString) {
          proxyReq.path = `${path}?${queryParamString}`;
          console.log(proxyReq.path);
        }
      }
  },
  "port": 8383,
  "middleware": [],
  // "serveStatic": [{
  //   "route": '/assets',
  //   "dir": 'assets'
  // }],
  "ghostMode": {
      "clicks": true,
      "scroll": true,
      "location": true,
      "forms": {
          "submit": true,
          "inputs": true,
          "toggles": true
      }
  },
  "logLevel": "info",
  "logPrefix": "Browsersync",
  "logConnections": false,
  "logFileChanges": true,
  "logSnippet": true,
  "snippetOptions": {
    "rule": {
        "match": /<\/body>/i,
        "fn": function (snippet, match) {
            return snippet + match;
        }
    }
  },
  "rewriteRules": [],
  "open": false,
  "browser": "default",
  "cors": false,
  "xip": false,
  "hostnameSuffix": false,
  "reloadOnRestart": false,
  "notify": true,
  "scrollProportionally": true,
  "scrollThrottle": 0,
  "scrollRestoreTechnique": "window.name",
  "scrollElements": [],
  "scrollElementMapping": [],
  "reloadDelay": 0,
  "reloadDebounce": 500,
  "reloadThrottle": 0,
  "plugins": [],
  "injectChanges": true,
  "startPath": null,
  "minify": false,
  "host": "0.0.0.0",
  "localOnly": false,
  "codeSync": true,
  "timestamps": true,
  "clientEvents": [
      "scroll",
      "scroll:element",
      "input:text",
      "input:toggles",
      "form:submit",
      "form:reset",
      "click"
  ],
  "socket": {
      "socketIoOptions": {
          "log": false
      },
      "socketIoClientConfig": {
          "reconnectionAttempts": 50
      },
      "path": "/browser-sync/socket.io",
      "clientPath": "/browser-sync",
      "namespace": "/browser-sync",
      "clients": {
          "heartbeatTimeout": 5000
      }
  },
  "tagNames": {
      "less": "link",
      "scss": "link",
      "css": "link",
      "jpg": "img",
      "jpeg": "img",
      "png": "img",
      "svg": "img",
      "gif": "img",
      "js": "script"
  },
  "injectNotification": false
};