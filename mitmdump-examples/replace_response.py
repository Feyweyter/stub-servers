from mitmproxy import http
import json, re

with open('user.json') as json_file:
    userData = json.load(json_file)

def request(flow: http.HTTPFlow):
    if flow.request.pretty_host == "api.github.com" and re.match('/users', flow.request.path):
        flow.response = http.HTTPResponse.make(
            200,  # (optional) status code
            json.dumps(userData),  # (optional) content
            {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }  # (optional) headers
        )
