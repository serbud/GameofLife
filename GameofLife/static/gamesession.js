//Функция добавления игровых сессий в список сессий.
function insertListGameSessions(nameGame, nameUser, colRounds, colCells, id_session){
    var control = "";

    control =
                        '<li style="list-style-type: none; border: 1px solid black" class="mb-4">' +
                            '<div style="display: flex; width:100%;">' +
                                '<div style="width:40%; border-right: 1px solid black" class="pt-3">' +
                                    '<p class="ml-4" style="font-weight:bold">Название сессии: <br><input type="text" value="' + nameGame + '" readonly class="ml-2" style="width:90%; font-size: 100%; line-height: normal; border: 0"></p>'+
                                    '<p class="ml-4" style="font-weight:bold">Создатель игры: <br><input type="text" value="' + nameUser + '" readonly class="ml-2" style="width:90%; font-size: 100%; line-height: normal; border: 0"></p>' +
                                '</div>' +
                                '<div style=" width:40%; border-right: 1px solid black" class="pt-3">' +
                                    '<p class="ml-4" style="font-weight:bold">Количество раундов: <br><input type="text" value="' + colRounds + '" readonly class="ml-2" style="width:90%; font-size: 100%; line-height: normal; border: 0; "></p>' +
                                    '<p class="ml-4" style="font-weight:bold">Количество ячеек: <br><input type="text" value="' + colCells + '" readonly class="ml-2" style="width:90%; font-size: 100%; line-height: normal; border: 0"></p>' +
                                '</div>' +
                                '<div style=" width:20%; display: flex; justify-content: center; align-items: center;">' +
                                    '<span onclick="addUserToSession('+ id_session +')" style="cursor: pointer;">' +
                                        '<div style="display: flex; justify-content: center; align-items: center;">' +
                                            '<svg   id="i-play" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">' +
                                                '<path d="M10 2 L10 30 24 16 Z" />' +
                                            '</svg>' +
                                        '</div>' +
                                    '</span>' +
                                '</div>' +
                            '</div>' +
                        '</li>'

    setTimeout(
        function(){
            $(".listSessions").append(control).scrollTop($(".listSessions").prop('scrollHeight'));
        });
}

//Функция-запрос для добавления игровой сессии в базу данных
function addGameSession(nameGame, colRounds, colCells) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/add_game_session', true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    data = {
        name: nameGame,
        count_rounds: colRounds,
        count_cells: colCells
    }
    data = JSON.stringify(data);
    xhr.onload = function(e){
      if (xhr.status != 200) {
        console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
      } else {
        var data = JSON.parse(xhr.responseText);
        if(data.code == '0'){
            document.location.href = "http://127.0.0.1:5000/test_socket";
        }
        else{
            alert("сессия не создалась!")
        }
      }
    }
    xhr.send(data);
}

//Функция для очищения чата
function resetListOfSessions(){
    $(".listSessions").empty();
}

function GetGameSession() {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/get_game_sessions', true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    data = {
        "":""
    }
    data = JSON.stringify(data);
    xhr.onload = function(e){
      if (xhr.status != 200) {
        console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
      } else {
        var data = JSON.parse(xhr.responseText);
        if(data.code == '0'){
            resetListOfSessions();
            console.log(data.game_sessions.length)
            for (var idx = 0; idx < data.game_sessions.length; idx++ ){
                console.log(data.game_sessions[idx].name)
                insertListGameSessions(data.game_sessions[idx].name,data.game_sessions[idx].creator,data.game_sessions[idx].count_rounds,data.game_sessions[idx].count_cells, data.game_sessions[idx].id)
            }
        }
        else{
            document.location.href = "http://127.0.0.1:5000/sign_in";
        }
      }
    }
    xhr.send(data);
}



//Функция-запрос для добавления игровой сессии в базу данных
function getNewGameSession() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/get_new_game_sessions', true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    data = {"":""}
    data = JSON.stringify(data);
    xhr.onload = function(e){
      if (xhr.status != 200) {
        console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
      } else {
        var data = JSON.parse(xhr.responseText);
        if(data.code == '0'){
            GetGameSession();
        }
        else{
            alert("пока что сессий нет!")
        }
      }
    }
    xhr.send(data);
  }

//Функция-запрос для добавления игровой сессии в базу данных
function addUserToSession(id) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/add_user_to_game_session', true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    data = {id_session: id}
    data = JSON.stringify(data);
    xhr.onload = function(e){
      if (xhr.status != 200) {
        console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
      } else {
        var data = JSON.parse(xhr.responseText);
        if(data.code == '0'){
            document.location.href = "http://127.0.0.1:5000/test_socket";
        }
        else{
            alert("невозможно подключиться к игре!")
        }
      }
    }
    xhr.send(data);
  }


//Функция-запрос для добавления игровой сессии в базу данных
function signOut() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/sign_out', true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    data = {"":""}
    data = JSON.stringify(data);
    xhr.onload = function(e){
      if (xhr.status != 200) {
        console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
      } else {
        document.location.href = "http://127.0.0.1:5000/sign_in";
      }
    }
    xhr.send(data);
  }

