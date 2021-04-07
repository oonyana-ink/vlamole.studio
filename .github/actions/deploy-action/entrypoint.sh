#!/bin/sh -l

BRANCH=${GITHUB_REF#refs/heads/}
echo "$GIT_CRYPT_KEY" | base64  -d > /tmp/git-crypt-key
cd ./theme
git-crypt unlock /tmp/git-crypt-key
npm install
npm run build:app
theme deploy --env=$BRANCH --allow-live