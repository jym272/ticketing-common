#!/usr/bin/env bash

set -eou pipefail

echo -e "\e[32mCleaning up dist folder\e[0m"
rm -rf dist
sed -i 's/"include": \["src\/\*\*\/\*", "tests\/\*\*\/\*"\],/"include": ["src\/\*\*\/\*"],/g' tsconfig.json
echo -e "\e[32mCompiling typescript\e[0m"
tsc && tsc-alias
sed -i 's/"include": \["src\/\*\*\/\*"\],/"include": ["src\/\*\*\/\*", "tests\/\*\*\/\*"],/g' tsconfig.json
echo -e "\e[32mCompiling typescript done\e[0m"