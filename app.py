import asyncio
import json
import os

from jinja2 import Environment, PackageLoader
from sanic import Sanic
from sanic.response import file, redirect, html

from bonusly import Bonusly
from db import DB
from utils import get_session_id, get_session_remaining_time

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
    session_id = get_session_id()
    DB().create_session(session_id)
    return redirect(f'/join/{session_id}')


@app.route('/join/<session_id>', methods=['GET', 'POST'])
async def join_room(request, session_id):
    template = env.get_template('templates/create-session.html')

    if request.method != 'POST':
        return html(template.render())

    token = request.form.get('token')
    me = Bonusly(token).me()

    if not me['success']:
        html_content = template.render(error=True)
        return html(html_content)
    else:
        username = me['result']['username']
        DB().add_player(session_id, username)

        return redirect(f'/room/{session_id}')


@app.route('/room/<session_id>', methods=['GET'])
async def room(request, session_id):
    template = env.get_template('templates/spin.html')

    session = DB().get_session(session_id)
    if not session:
        return redirect('/')

    players = DB().get_players_by_session_id(session_id)

    return html(
        template.render(
            players=players, session_id=session_id
        )
    )


@app.websocket('/spin/<session_id>')
async def feed(request, ws, session_id):
    while True:
        players = DB().get_players_by_session_id(session_id)
        session = DB().get_session(session_id)
        _, created = session

        data = {
            'players': players,
            'remaining_time': get_session_remaining_time(created)
        }

        await ws.send(json.dumps(data))
        await asyncio.sleep(1)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=4000, debug=True)
