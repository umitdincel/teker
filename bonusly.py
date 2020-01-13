from urllib.parse import urljoin

import requests


class Bonusly(object):
    API = 'https://bonus.ly/api/v1/'

    def __init__(self, token):
        self.token = token

    def request(self, path, method, body=None, _headers=None):
        headers = {
            'Content-Type': 'application/javascript'
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

        from utils import get_session_id
        username = get_session_id(12)
        return {'success': True, 'result': {'username': username}}
        # return self.request(path, method='GET')
