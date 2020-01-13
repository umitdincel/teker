import random
from datetime import datetime

from constants import SESSION_DURATION


def get_session_id(length=8):
    alphabet = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ' \
               'abcdefghijkmnopqrstuvwxyz'

    return ''.join(
        [
            random.choice(alphabet)
            for _ in range(length)
        ]
    )


def get_session_remaining_time(created):
    now = datetime.now().timestamp()
    remaining_time = SESSION_DURATION - (int(now) - int(created))
    return remaining_time if remaining_time > 0 else 0
