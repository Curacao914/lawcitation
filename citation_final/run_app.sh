#!/bin/bash

# 定义项目路径
PROJECT_PATH="/Users/curacao/Script/citation"

# 定义日志文件路径
LOG_FILE="$PROJECT_PATH/app.log"

# 进入项目目录
cd "$PROJECT_PATH" || exit

# 启动 Python 应用（静默运行，输出重定向到日志文件）
nohup python3 app.py > "$LOG_FILE" 2>&1 &
PYTHON_PID=$!  # 获取 Python 进程的 PID

# 等待 Python 应用启动（可根据需要调整等待时间）
sleep 2

# 打开 HTML 文件（使用默认浏览器）
open index.html