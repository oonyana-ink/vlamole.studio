#!/bin/bash

COMMAND="$1"
shift

case "$COMMAND" in
  start_dev)
    echo "START DEV"

    themeify setup
    themeify generate_ssl_certs
    themeify init
    themeify start

    echo ""
    echo "> NPM Install"
    echo "  -----------"
    npm install
    # npm run webpackserver &
    npm run devserver
    ;;

  *)
    echo $"Usage: This needs to be filled..."
    exit 1

esac