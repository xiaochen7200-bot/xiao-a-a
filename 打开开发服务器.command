#!/bin/bash
cd "$(dirname "$0")"
chmod +x install.sh dev.sh scripts/ensure-node.sh 2>/dev/null || true
if [[ ! -d node_modules ]]; then
  ./install.sh
fi
./dev.sh
