#!/bin/bash
# 安装依赖（无需系统已安装 npm）
set -euo pipefail
cd "$(dirname "$0")"
chmod +x scripts/ensure-node.sh
./scripts/ensure-node.sh npm install
echo ""
echo "安装完成。启动开发服务器请运行: ./dev.sh"
