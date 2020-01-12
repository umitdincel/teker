import os

import shortuuid
from sanic import Sanic
from sanic.response import file, redirect, text, html
from jinja2 import Environment, PackageLoader

from bonusly import Bonusly
from db import DB

db = {}
app = Sanic(__name__)
env = Environment(loader=PackageLoader('app', 'static'))

STATIC_FOLDER = os.path.join(os.path.dirname(__file__), 'static')

app.static('/static', STATIC_FOLDER)


@app.route('/')
async def index(request):
    return await file('static/templates/index.html')


@app.route('/create-session', methods=['POST'])
async def create_session(request):
    session_id = shortuuid.uuid()
    DB().create_session(session_id)
    return redirect(f'/join/{session_id}')


@app.route('/join/<session_id>', methods=['GET', 'POST'])
async def join_room(request, session_id):
    if request.method != 'POST':
        return await file('static/templates/create-session.html')

    token = request.form.get('token')
    me = Bonusly(token).me()

    if not me['success']:
        return await file('static/templates/create-session.html')
    else:
        username = me['result']['username']
        DB().add_player(session_id, username)

        return redirect(f'/room/{session_id}')


@app.route('/room/<session_id>', methods=['GET'])
async def room(request, session_id):
    players = DB().get_players_by_session_id(session_id)

    template = env.get_template('templates/spin.html')
    html_content = template.render(title='yucuk')
    return html(html_content)
    # return await file('static/templates/spin.html')


@app.websocket('/spin')
async def feed(request, ws):
    while True:
        data = 'hello!'
        print('Sending: ' + data)
        await ws.send(data)
        data = await ws.recv()
        print('Received: ' + data)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=4000, debug=True)
