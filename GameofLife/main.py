from flask import Flask, request, make_response, jsonify
from flask_socketio import SocketIO
from flask import render_template
from models import *
import json
import uuid

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


@app.route('/sign_up', methods=['GET'])
def sign_up():
    return render_template('sign_up.html')

@app.route('/POST_sign_up', methods=['POST'])
def POST_sign_up():
    data = request.get_json()
    print(data)
    us = User.get_or_none(login=data["login"])
    if us != None:
        return json.dumps({"code": "1"})

    us = User.get_or_none(email=data["email"])
    if us != None:
        return json.dumps({"code": "1"})

    us = User(
        login=str(data["login"]),
        email=str(data["email"]),
        password=str(data["password"])
    )
    us.save()
    return json.dumps({"code":"0"})

# @app.route('/sign_in', methods=['POST'])
# def POST_sign_in():
#     data = request.get_json()
#
#     return render_template('sign_in.html')

@app.route('/sign_in',methods=['GET'])
def sign_in():
    return render_template('signin.html')

@app.route('/sign_in',methods=['POST'])
def POST_sign_in():

    data = request.get_json()
    us = User.get_or_none(login=data["login"], password=data["password"])
    if us != None:
        x = str(uuid.uuid1())
        us.access_key = x
        us.save()
        res = make_response(json.dumps({"code":"0"}))
        res.set_cookie("access_key", x)
        return res
    else:
        return json.dumps({"code":"1"})


@app.route('/add_game_session',methods=['POST'])
def add_game_session():
    access_key = request.cookies.get("access_key")
    if access_key != None:
        us = User.get_or_none(access_key=access_key)
        if us != None:
            data = request.get_json()
            gs = GameSession(
                name=data["name"],
                count_rounds=data["count_rounds"],
                count_cells=data["count_cells"],
                user1=us
            )
            gs.save()
            if 'password' in data:
                gs.password = data["password"]
                gs.save()
            return json.dumps({"code": "0"})
        else:
            return json.dumps({"code": "1"})
    else:
        return json.dumps({"code":"1"})


@app.route('/', methods=['GET'])
def game_sessions():
    return "darova"

@socketio.on('my event')
def handle_my_custom_event(json):
    print('received json: ' + str(json))




if __name__ == '__main__':
    try:
        dbhandle.create_tables([User,  GameSession])
    except peewee.InternalError as px:
        print(str(px))
    socketio.run(app)