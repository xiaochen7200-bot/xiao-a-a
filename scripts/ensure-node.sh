#!/bin/bash
# 若系统没有 npm，则下载便携版 Node.js 到项目 .tools 目录
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NODE_VERSION="v22.15.0"
NODE_DIR="$ROOT/.tools/node"

if command -v npm >/dev/null 2>&1; then
  export PATH="$(dirname "$(command -v npm)"):$PATH"
  exec "$@"
fi

if [[ -x "$NODE_DIR/bin/npm" ]]; then
  export PATH="$NODE_DIR/bin:$PATH"
  exec "$@"
fi

ARCH="$(uname -m)"
case "$ARCH" in
  arm64) NODE_PKG="node-${NODE_VERSION}-darwin-arm64" ;;
  x86_64) NODE_PKG="node-${NODE_VERSION}-darwin-x64" ;;
  *)
    echo "不支持的 CPU 架构: $ARCH"
    echo "请手动安装 Node.js: https://nodejs.org/"
    exit 1
    ;;
esac

TARBALL_URL="https://nodejs.org/dist/${NODE_VERSION}/${NODE_PKG}.tar.gz"
TMP="$ROOT/.tools/${NODE_PKG}.tar.gz"

echo "=========================================="
echo "  未检测到 npm，正在安装便携版 Node.js"
echo "  版本: ${NODE_VERSION}（仅首次需要下载）"
echo "=========================================="
mkdir -p "$ROOT/.tools"

if ! curl -fSL "$TARBALL_URL" -o "$TMP"; then
  echo "下载失败，请检查网络后重试。"
  echo "或访问 https://nodejs.org/ 安装 Node.js 后执行 npm install"
  exit 1
fi

tar -xzf "$TMP" -C "$ROOT/.tools"
rm -f "$TMP"
rm -rf "$NODE_DIR"
mv "$ROOT/.tools/$NODE_PKG" "$NODE_DIR"

export PATH="$NODE_DIR/bin:$PATH"
echo "Node 已就绪: $(node -v)"
exec "$@"
