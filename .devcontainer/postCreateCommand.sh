#!/usr/bin/sh

# Install npm dependencies for app
npm i
npm i -g ghost-cli@latest
npm i -g gscan@latest

# Install Ghost
cd /workspaces
mkdir ghost
cd ghost
ghost install local --no-start

# symlink the current folder to the ghost themes folder
ln -s /workspaces/Ghost-Starter /workspaces/ghost/content/themes/Ghost-Starter

cd /workspaces/Ghost-Starter
