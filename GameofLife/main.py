from flask import Flask, request, make_response, jsonify
from flask_socketio import SocketIO, send, emit
from flask import render_template
from models import *
import json
import uuid
import time
import pickle





app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


@app.route('/sign_up', methods=['GET'])
def sign_up():
    return render_template('sign_up.html')

@app.route('/sign_up', methods=['POST'])
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

@app.route('/',methods=['GET'])
def main_page():
    return render_template('gamesession.html')

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
            print("ALARM!!!ALARM!!!ALARM!!!ALARM!!!ALARM!!!ALARM!!!")
            if 'password' in data:
                gs.password = data["password"]
                gs.save()

            for cc in ChangeChecked.select():
                cc.checked = False
                cc.save()

            return json.dumps({"code": "0"})
        else:
            return json.dumps({"code": "1"})
    else:
        return json.dumps({"code":"1"})



@app.route('/get_game_sessions', methods=['GET'])
def game_sessions():
    access_key = request.cookies.get("access_key")
    if access_key != None:
        us = User.get_or_none(User.access_key == access_key)
        if us != None:
            gsm = []
            for session in GameSession.select().where(GameSession.user2 == None):
                creator = session.user1
                gs={
                    "id": str(session.id),
                    "name": session.name,
                    "count_rounds": str(session.count_rounds),
                    "count_cells": str(session.count_cells),
                    "creator": creator.login
                }
                gsm.append(gs)

            cc = ChangeChecked.get_or_none(ChangeChecked.user == us)
            if cc != None:
                cc.checked = True
            else:
                cc = ChangeChecked(
                    user = us
                )
            cc.save()



            return json.dumps({"game_sessions": gsm})
        else:
            return json.dumps({"code": "1"})
    else:
        return json.dumps({"code": "1"})


  # else:
  #                   return json.dumps({"code": "3"})
  #           else:
  #               return json.dumps({"code": "2"})
  #       else:
  #           return json.dumps({"code": "1"})
  #   else:
  #       return json.dumps({"code":"1"})



@app.route('/add_user_to_game_session', methods=['POST'])
def add_user_to_game_session():
    access_key = request.cookies.get("access_key")
    if access_key != None:
        us = User.get_or_none(User.access_key == access_key)
        if us != None:

            data = request.get_json()
            gs = GameSession.get_or_none(GameSession.id == int(data["id_session"]))
            if gs != None:
                if us != gs.user1:

                    gs.user2 = us
                    gs.round += 1
                    gs.save()

                    for cc in ChangeChecked.select():
                        cc.checked = False
                        cc.save()

                    return json.dumps({"code": "0"})

                else:
                    return json.dumps({"code": "3"})
            else:
                return json.dumps({"code": "2"})
        else:
            return json.dumps({"code": "1"})
    else:
        return json.dumps({"code":"1"})

@app.route('/delete_game_session', methods=['DELETE'])
def delete_game_session():
    access_key = request.cookies.get("access_key")
    if access_key != None:
        us = User.get_or_none(User.access_key == access_key)
        if us != None:

            data = request.get_json()
            gs = GameSession.get_or_none(GameSession.id == int(data["id_session"]))
            if gs != None:
                if (us == gs.user1 or us == gs.user2):
                    if gs.user2 != None:
                        for cc in ChangeChecked.select():
                            cc.checked = False
                            cc.save()

                    gs.delete_instance()

                    return json.dumps({"code": "0"})

                else:
                    return json.dumps({"code": "3"})
            else:
                return json.dumps({"code": "2"})
        else:
            return json.dumps({"code": "1"})
    else:
        return json.dumps({"code": "1"})

@app.route('/get_new_game_sessions', methods=['GET'])
def get_new_game_sessions():
    start = time.monotonic()
    now = time.monotonic()
    passtime = 0
    access_key = request.cookies.get("access_key")

    if access_key != None:
        us = User.get_or_none(User.access_key == access_key)
        if us != None:

            start = time.monotonic()
            now = time.monotonic()
            passtime = 0
            f = False
            while (not f and passtime<60):

                cc = ChangeChecked.get_or_none(ChangeChecked.user == us)
                f = not cc.checked
                now = time.monotonic()
                passtime = '{:>9.2f}'.format(now - start)
                passtime = float(passtime)

            return json.dumps({"code": "0",
                               "changed":str(f)
                            })



        else:
            return json.dumps({"code": "1"})
    else:
        return json.dumps({"code": "1"})


@app.route('/course', methods=['POST'])
def course():
    access_key = request.cookies.get("access_key")
    if access_key != None:
        us = User.get_or_none(User.access_key == access_key)
        if us != None:
            us.ready = True
            us.save()
            gs = GameSession.get_or_none(GameSession.user1 == us)
            if gs == None:
                gs = GameSession.get_or_none(GameSession.user2 == us)
            if gs != None:
                u1 = gs.user1
                u2 = gs.user2
                if (u1.ready and u2.ready):
                    try:
                        f = open('worlds/'+gs.name+".pickle", 'rb')

                        world = pickle.load(f)
                    except:
                        f = open('worlds/'+gs.name+".pickle", 'wb')
                        world = [[0 for i1 in range(N+2)] for j1 in range(M+2)]

                    print(world[4][3])

                    for i1 in world:
                        print(i1)



                    print("WORLD ")



                    for i in range(1 ,N+1 ,1):
                        for j in range(1, M+1, 1):


                            if world[i][j] == 3:
                                world[i][j] = 1

                            if world[i][j] == 4:
                                world[i][j] = 2

                    world2 = [[0 for i1 in range(N+2)] for j1 in range(M+2)]

                    for i in range(1 ,N+1 ,1):
                        for j in range(1, M+1, 1):
                            g1 = 0
                            g2 = 0

                            if world[i][j] == 3:
                                world[i][j] = 1

                            if world[i][j] == 4:
                                world[i][j] = 2

                            #GAMER1
                            if (i == 3 and j == 4):
                                print("")
                                print("")
                                print("")

                            if world[i-1][j-1] == 1:
                                g1 += 1

                            if world[i][j-1] == 1:
                                g1 += 1
                            print(world[4][3])
                            if world[i+1][j-1] == 1:
                                g1 += 1

                            if world[i-1][j] == 1:
                                g1 += 1

                            if world[i+1][j] == 1:
                                g1 += 1

                            if world[i-1][j+1] == 1:
                                g1 += 1

                            if world[i][j+1] == 1:
                                g1 += 1

                            if world[i+1][j+1] == 1:
                                g1 += 1


                            # GAMER2
                            if world[i - 1][j - 1] == 2:
                                g2 += 1

                            if world[i][j - 1] == 2:
                                g2 += 1

                            if world[i + 1][j - 1] == 2:
                                g2 += 1

                            if world[i - 1][j] == 2:
                                g2 += 1

                            if world[i + 1][j] == 2:
                                g2 += 1

                            if world[i - 1][j + 1] == 2:
                                g2 += 1

                            if world[i][j + 1] == 2:
                                g2 += 1

                            if world[i + 1][j + 1] == 2:
                                g2 += 1


                            if g1 != 0:
                                print(g1)
                            if g2 != 0:
                                print(g2)

                            if (g1 == 3 and g2 == 3):
                                world2[i][j] = 0


                            elif g1 == 3:
                                world2[i][j] = 1

                            elif g2 == 3:
                                world2[i][j] = 2

                            elif (world[i][j] == 1 and (g1 > 3 or g1 < 2)):

                                world2[i][j] = 0

                            elif (world[i][j] == 2 and (g2 > 3 or g2 < 2)):

                                world2[i][j] = 0
                            else:
                                world2[i][j] = world[i][j]

                    f.close()



                    f = open('worlds/'+gs.name+".pickle", 'wb')
                    pickle.dump(world2, f)
                    f.close()


                    print("")
                    print("")
                    print("")
                    print("")

                    for i in  world2:
                        print(i)

                    gs.round += 1
                    gs.save()


                    return "daafa"
                else:
                    return json.dumps({"code": "3"})
            else:
                return json.dumps({"code": "2"})

        else:
            return json.dumps({"code": "1"})
    else:
        return json.dumps({"code": "1"})


# @socketio.on('my event')
# def handle_my_custom_event(json):
#     print('received json: ' + str(json))
#     send(json, json=True)

@socketio.on('message')
def handleMessage(id, i, j):


    print('Message: ' + id, i, j)
    us1 = User.get_or_none(User.id == id)
    gs = GameSession.get_or_none(GameSession.user1 == id)

    if gs == None:
        gs = GameSession.get_or_none(GameSession.user2 == id)

    f = open('worlds/' + gs.name + ".pickle", 'rb')
    world = pickle.load(f)
    f.close()
    f = open('worlds/' + gs.name + ".pickle", 'wb')
    i = int(i)
    j = int(j)
    if id == str(gs.user1):
        if world[i][j] == 0:
            world[i][j] = 3
        elif world[i][j] == 3:
            world[i][j] = 0
    else:
        if world[i][j] == 0:
            world[i][j] = 4
        elif world[i][j] == 4:
            world[i][j] = 0

    for i in world:
        print(i)


    pickle.dump(world, f)
    f.close()


    us1 = gs.user1
    us2 = gs.user2

    send((us1.login, us2.login, i, j), broadcast=True)


@app.route('/test_socket', methods=['GET'])
def test_socket():
    access_key = request.cookies.get("access_key")
    if access_key != None:
        us = User.get_or_none(User.access_key == access_key)
        if us != None:
            return render_template('test.html', id = str(us.id))


        else:
            return json.dumps({"code": "1"})
    else:
        return json.dumps({"code": "1"})



if __name__ == '__main__':
    try:
        dbhandle.create_tables([User,  GameSession, ChangeChecked])
    except peewee.InternalError as px:
        print(str(px))

    N = 5
    M = 5
    socketio.run(app)