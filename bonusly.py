from urllib.parse import urljoin

import requests


class Bonusly(object):
    API = 'https://bonus.ly/api/v1/'
    TEST_TOKEN = 'a0737099c2203ecfce10555e78eeec26'

    def __init__(self, token):
        self.token = token

    def request(self, path, method, body=None, _headers=None):
        headers = {
            'Content-Type':'application/javascript'
        }

        if _headers:
            headers.update(headers)

        params = {
            'access_token': self.token
        }

        url = urljoin(self.API, path)

        response = requests.request(
            url=url, method=method, params=params, 
            headers=headers, data=body
        )

        return response.json()

    def me(self):
        path = 'users/me'
        
        return self.request(path, method='GET')
