#!/usr/bin/env bash

yarn prettier-format && yarn build

if [[ $(git ls-files -m -o | grep -E '^(dist|src)\/') ]]; then
  echo "files modified unexpectedly, did you forget to run yarn prettier-format or yarn build?"
  exit 1
fi
