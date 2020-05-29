from mitmproxy import http
import json

with open('user.json') as json_file:
    userData = json.load(json_file)

def request(flow: http.HTTPFlow):
    print('flow.request.pretty_host', flow.request.pretty_host)
    if flow.request.pretty_host == "api.github.com":
        flow.response = http.HTTPResponse.make(
            200,  # (optional) status code
            json.dumps(userData),  # (optional) content
            {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }  # (optional) headers
        )
