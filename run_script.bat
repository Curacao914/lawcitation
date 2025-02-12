@echo off
echo 当前工作目录：%CD%

rem 激活虚拟环境
call myenv\Scripts\activate

rem 进入指定目录
cd /d "法学引注格式转换（v1.1）"

rem 后台启动 Python 脚本
start /B python app.py

rem 打开 HTML 文件，使用相对路径
start "" index.html