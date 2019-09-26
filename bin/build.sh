#!/bin/sh

WORK_DIR=$1
profile=$2

cd $WORK_DIR

rm -rf node_modules
rm -rf /tmp/chromedriver/

#npm install --save mizhi-ui-core --registry=http://120.27.218.59:8081/repository/npm-group/

cnpm install

npm run prod

#rm -rf mizhi-btbs-apidoc
#mkdir mizhi-btbs-apidoc
#
#cp -rf dist/* mizhi-btbs-apidoc
#
#tar -czvf dist/mizhi-btbs-apidoc.tar.gz ./mizhi-btbs-apidoc
#
#mv  mizhi-btbs-apidoc dist
