#!/bin/sh

WORK_DIR=$1
profile=$2

cd $WORK_DIR

rm -rf node_modules
rm -rf /tmp/chromedriver/

cnpm install

npm run release

rm -rf apidoc
mkdir apidoc

cp -rf dist/* apidoc

tar -czvf dist/tianyandata-apidoc.tar.gz ./apidoc
