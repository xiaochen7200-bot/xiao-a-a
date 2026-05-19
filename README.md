# AI内容工厂控制台

记录每日工作行为、分类、用时与产出，帮助看清时间分配与有效工作。

## 快速开始（Mac，无需事先安装 Node）

在终端进入项目目录后执行：

```bash
cd /Users/ymdx/ai-content-factory-console
chmod +x install.sh dev.sh scripts/ensure-node.sh
./install.sh    # 首次运行，自动下载 Node 并安装依赖
./dev.sh        # 启动开发服务器
```

浏览器打开终端里显示的地址（一般是 `http://localhost:5173`）。

也可以 **双击** 项目里的 `打开开发服务器.command`（首次会自动安装）。

## 若已安装 Node.js

```bash
npm install
npm run dev
```

构建生产版本：

```bash
npm run build
```

## 常见问题

**`zsh: command not found: npm`**

说明系统未安装 Node.js。请使用上面的 `./install.sh` 和 `./dev.sh`，不要直接输入 `npm`。

**推荐长期方案**

从 [https://nodejs.org/](https://nodejs.org/) 下载安装 LTS 版 Node.js，安装后重启终端，即可正常使用 `npm install` 和 `npm run dev`。

## 功能

- 计时器：开始 / 暂停 / 继续 / 结束保存（刷新后恢复进行中任务）
- 结束任务时必填产出结果
- 今日工作记录列表
- 数据统计与最近 7 天趋势
- 分类汇总卡片
- 数据保存在浏览器 localStorage
