#!/bin/bash
# 启动开发服务器（无需系统已安装 npm）
set -euo pipefail
cd "$(dirname "$0")"

if [[ ! -d node_modules ]]; then
  echo "未找到 node_modules，先执行安装..."
  ./install.sh
fi

chmod +x scripts/ensure-node.sh
./scripts/ensure-node.sh npm run dev
