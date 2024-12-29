@echo off
echo 当前工作目录：%CD%
rem
cd /d "法学引注格式转换（v1.1）"
start /B python app.py
start index.html
nircmd win min class ConsoleWindowClass