from flask import (
    session,
    redirect,
    url_for,
    render_template,
    request,
    Blueprint
)
from config import PUBLIC_ROOMS
import json
main = Blueprint('main', __name__)


@main.route('/')
def index():
    name = session.get('name', '')
    return render_template('index.html', public_rooms=PUBLIC_ROOMS, name=name)


@main.route('/enter', methods=['POST'])
def enter():
    """
    加入聊天室, 将 name 和 room 保存在 session 里
    """
    name = request.form.get('name', '').strip()
    if name != '':
        session['name'] = name
        # 自定义房间列表用 json 格式保存在 session 里
        rooms = json.loads(session.get('custom_rooms', '[]'))
        room = (request.form.get('customRoom') or request.form.get('selectRoom')).strip()
        session['room'] = room
        if room not in (rooms + PUBLIC_ROOMS):
            rooms.append(room)
            session['custom_rooms'] = json.dumps(rooms)
        return redirect(url_for('.chat'))
    else:
        return redirect(url_for('.index'))


@main.route('/chat')
def chat():
    name = session.get('name', '')
    if name == '':
        return redirect(url_for('.index'))
    else:
        r = session.get('room', PUBLIC_ROOMS[0])
        rs = json.loads(session.get('custom_rooms', '[]'))
        return render_template('chat.html', current_room=r, custom_rooms=rs, public_rooms=PUBLIC_ROOMS)
