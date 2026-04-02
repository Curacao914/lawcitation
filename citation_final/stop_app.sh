#!/bin/bash

# 定义项目路径
PROJECT_PATH="/Users/curacao/Script/citation"

# 进入项目目录
cd "$PROJECT_PATH" || exit

# 查找并终止所有运行中的app.py进程
echo "正在查找并终止运行中的 app.py 进程..."
ps aux | grep 'app.py' | grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {} 2>/dev/null

# 检查是否成功终止进程
if ! ps aux | grep 'app.py' | grep -v grep > /dev/null; then
    echo "✅ 成功终止 app.py 进程"
else
    echo "⚠️ 无法终止 app.py 进程，可能进程未运行或已被其他方式终止"
fi

# 使用 AppleScript 关闭终端应用程序
echo "正在关闭终端应用程序..."
osascript <<EOD
tell application "Terminal"
    quit
end tell
EOD

echo "✅ 终端应用程序已关闭"