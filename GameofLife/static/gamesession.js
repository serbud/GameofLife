//Функция добавления игровых сессий в список сессий.
function insertListGameSessions(nameGame, nameUser, colRounds, colCells){
    alert(nameGame);
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
                                    '<span onclick="" style="cursor: pointer;">' +
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

        }
        else{

        }

      }
    }
    xhr.send(data);
}