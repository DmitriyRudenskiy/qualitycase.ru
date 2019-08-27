#!/bin/bash
#
# Add to cron
# * * * * * root if [ $(ps aux | grep 'qualitycase.ru/auto_deploy.sh' | grep -v grep | wc -l | tr -s "\n") -lt 1 ]; then /var/www/qualitycase.ru/auto_deploy.sh > /dev/null 2>&1; fi

# Check directory
SCRIPT_PATH=$(dirname ${BASH_SOURCE[0]})
echo "Work directory: $SCRIPT_PATH"
cd "$SCRIPT_PATH" || exit

# Check branch
if [[ $(git rev-parse --abbrev-ref HEAD) != master ]]; then
  git checkout master
fi

# Check update
git fetch
HEADHASH=$(git rev-parse HEAD)
UPSTREAMHASH=$(git rev-parse master@{upstream})

if [ "$HEADHASH" == "$UPSTREAMHASH" ]; then
  echo Not up to date with origin. Aborting
  echo
  exit 0
else
  echo Start update from original/master
  git pull
  npm install --production
  pm2 restart all --update-env
fi
