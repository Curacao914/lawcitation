import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dashscope import Application
from http import HTTPStatus
import requests
from requests.adapters import HTTPAdapter, Retry
from config import API_KEY

app = Flask(__name__)
CORS(app)

# 创建请求会话，配置重试机制
session = requests.Session()
retries = Retry(total=5, backoff_factor=0.3)
session.mount("https://", HTTPAdapter(max_retries=retries))

@app.route('/api/call-ai', methods=['POST'])
def call_ai():
    try:
        # 从前端获取请求数据
        data = request.json
        prompt = data.get("prompt", "")

        # 调用百炼 API
        api_response = Application.call(
            api_key=API_KEY,
            app_id='3cf439eac83f4b069061a7b20e05370d',
            prompt=prompt
        )

        # 检查调用状态
        if api_response.status_code != HTTPStatus.OK:
            return jsonify({
                "error": f"API call failed with status {api_response.status_code}",
                "message": api_response.message
            }), 500

        # 返回百炼 API 的文本输出
        return jsonify({"response": api_response.output.text})

    except Exception as e:
        # 捕获异常并返回错误信息
        print(f"Error occurred: {e}")
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)




@app.route('/test-api')
def test_api():
    return jsonify({"message": "Test API is working!"})

print(api_response)
print(api_response.output.text)
