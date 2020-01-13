import logging
import sqlite3
from datetime import datetime
from constants import PLAYER_DB, SESSION_DB

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

con = sqlite3.connect('db.sql')
cur = con.cursor()

logger.debug('creating tables: [%s, %s]', SESSION_DB, PLAYER_DB)
cur.execute(f"create table if not exists {SESSION_DB}(id, created_at)")
cur.execute(f"create table if not exists {PLAYER_DB}(session_id, username)")


class DB(object):
    def __init__(self):
        self.cur = con.cursor()

    def create_session(self, session_id):
        timestamp = int(datetime.now().timestamp())
        self.cur.execute(f"insert into {SESSION_DB} values ('{session_id}', '{timestamp}')")
        con.commit()

    def get_session(self, session_id):
        result = self.cur.execute(
            f"select * from {SESSION_DB} "
            f"where id=:session_id limit 1",
            {'session_id': session_id}
        )
        return result.fetchone()

    def get_sessions(self):
        result = self.cur.execute(f"select * from {SESSION_DB}")
        return result.fetchall()

    def add_player(self, session_id, username):
        player = self.cur.execute(
            f"select username from {PLAYER_DB} "
            f"where session_id=:session_id and username=:username",
            {'session_id': session_id, 'username': username}
        )

        if not player.fetchone():
            self.cur.execute(f"insert into {PLAYER_DB} values ('{session_id}', '{username}')")
            con.commit()

    def get_players(self):
        result = self.cur.execute(f"select * from {PLAYER_DB}")
        return result.fetchall()

    def get_players_by_session_id(self, session_id):
        result = self.cur.execute(
            f"select * from {PLAYER_DB} where session_id=:session_id",
            {'session_id': session_id}
        )
        return [username for _, username in result.fetchall()]


if __name__ == '__main__':
    DB().add_player('ABC', 'umitdincel')
    DB().add_player('ABC', 'osmancelik')
    DB().add_player('ABC', 'enesunal')

    print(DB().get_players())

    for player in DB().get_players_by_session_id('ABC'):
        print(player)

    DB().create_session('ABC')
    print(DB().get_sessions())
