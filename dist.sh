#!/bin/bash
# AUTHOR:   fanzeyi
# CREATED:  11:19:16 15/08/2013
# MODIFIED: 11:19:16 15/08/2013

PACKAGED_PATH=`pwd`

rm -rf /tmp/`basename $PACKAGED_PATH`
cd /tmp
cp -r $PACKAGED_PATH .
cd `basename $PACKAGED_PATH`
rm -rf .git
rm dist.sh
rm .gitignore
cd /tmp
zip -r v2ex-blocker.zip `basename $PACKAGED_PATH`
