from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # 允许所有来源的跨域请求

@app.route('/proxy', methods=['POST'])
def proxy():
    url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer bfeb9f5616e8863e498539b8789ba27d.qxbqtUPkzNRqcslP'
    }
    try:
        response = requests.post(url, headers=headers, json=request.json)
        print("Request JSON:", request.json)
        print("Response Status Code:", response.status_code)
        print("Response JSON:", response.json())
        response.raise_for_status()  # Raise an exception for HTTP errors
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        print("Error during request:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)