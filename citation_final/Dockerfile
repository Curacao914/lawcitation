# 使用官方 Python 3.9 镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 复制依赖文件并安装
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制后端代码
COPY . .

# 暴露 HF 默认的 7860 端口
EXPOSE 7860

# 使用 gunicorn 启动 Flask 应用
CMD ["gunicorn", "-b", "0.0.0.0:7860", "app:app"]
