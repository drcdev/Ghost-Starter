#!/usr/bin/sh

# Install npm dependencies for app
npm i
npm i -g ghost-cli@latest
npm i -g gscan@latest
npm i -g @anthropic-ai/claude-code

# Install Ghost
cd /workspaces
mkdir ghost
cd ghost
ghost install local --no-start

# symlink the current folder to the ghost themes folder
ln -s /workspaces/flux /workspaces/ghost/content/themes/flux

cd /workspaces/flux
