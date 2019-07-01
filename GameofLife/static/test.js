var canvas = document.getElementById('c1'); // получим canvas
var ctx = canvas.getContext('2d');

var mas = [];

var count = 0;
var timer;

function createLine(){
    for (var x = 0.5; x < 500; x += 10) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 500);
    }

    for (var y = 0.5; y < 500; y += 10) {
    ctx.moveTo(0, y);
    ctx.lineTo(500, y);
    }
    ctx.strokeStyle = "#ccc";
    ctx.stroke();
}

// Создадим игровое поле.
function goLife() {
    createLine();
    var n = 50, m = 50; // Создадим массив, который имитирует игровое поле.
    for(var i = 0; i < m; i++) {
        mas[i]=[]; // объявим пустой массив
        for(var j = 0; j < n; j++) {
            mas[i][j] = 0;
        }
    }
}

goLife();

function drawField(color,x,y) {
    createLine();
    console.log(color,x,y)
    if(color == 1) {
        console.log("blue");
        ctx.fillStyle = "blue";
        ctx.fillRect(x*10+1, y*10+1, 9, 9);
    }
    else if(color == 2) {
        console.log("red");
        ctx.fillStyle = "red";
        ctx.fillRect(x*10+1, y*10+1, 9, 9);
    }
    else if(color == 0){
        console.log("white");
        ctx.fillStyle = "white";
        ctx.fillRect(x*10+1, y*10+1, 9, 9);
    }
}

function sock(option){
    on_spinner = document.getElementById('spinner');
    on_spinner.classList.add("spinner-border");
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/course', true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    data = {code:option}
    data = JSON.stringify(data);
    xhr.onload = function(e){
      if (xhr.status != 200) {
        console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
      }
      else {
        var data = JSON.parse(xhr.responseText);
        if (data.code == "1")
        {document.location.href = "http://127.0.0.1:5000/sign_in";}
        if (data.code == "2")
        {document.location.href = "http://127.0.0.1:5000/";}

        if (data.code == 5)
        {
            console.log("lp ready")
            get_ready();
        }
        else{
        if(data.code == 0){


            for (var idx = 0; idx < data.new_world.length; idx++ ){
              drawField(data.new_world[idx].value, (data.new_world[idx].j) - 1 , data.new_world[idx].i - 1); }
                cells = document.getElementById('state');
                cells.value = data.state_response;
                rounds = document.getElementById('round');
                rounds.value = data.round;
                on_spinner = document.getElementById('spinner');
                on_spinner.classList.remove("spinner-border");
                if (data.winner == 1){alert("вы победили");
                document.location.href = "http://127.0.0.1:5000/";}
                 else if (data.winner == 2){alert("вы проиграли");
                 document.location.href = "http://127.0.0.1:5000/";}


        }
        else{
        console.log("fff")
        }
        }
    }}
    xhr.send(data);
}



function get_ready(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/lp_check_ready', true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    data = {"":""}
    data = JSON.stringify(data);



    xhr.onload = function(e){
      if (xhr.status != 200) {
        console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
      } else {
             var data = JSON.parse(xhr.responseText);
            if(data.changed == "True"){
                for (var idx = 0; idx < data.new_world.length; idx++ ){
                    drawField(data.new_world[idx].value, (data.new_world[idx].j) - 1 , data.new_world[idx].i - 1);
                    }
                 cells = document.getElementById('state');
                 cells.value = data.state_response;
                 rounds = document.getElementById('round');
                 rounds.value = data.round;
                 console.log("rounds.value: ", rounds.value);
                 on_spinner = document.getElementById('spinner');
                 on_spinner.classList.remove("spinner-border");
                 if (data.winner == 2){alert("вы победили");
                 document.location.href = "http://127.0.0.1:5000/";}
                 else if (data.winner == 1){alert("вы проиграли");
                 document.location.href = "http://127.0.0.1:5000/";}
            }
            else{
                get_ready();
            }

    }}
    xhr.send(data);
}


//
//function get_ready1(){
//
//    var xhr = new XMLHttpRequest();
//    xhr.open('GET', '/lp_check_ready', true);
//    xhr.setRequestHeader('Content-Type', 'application/json')
//    data = {"":""}
//    data = JSON.stringify(data);
//
//    xhr.onload = function(e){
//        if (xhr.status != 200) {
//            console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
//        } else {
//            var data = JSON.parse(xhr.responseText);
//            if(data.changed == "True"){
//                console.log('чат не выбран!')
//            }
//            else{
//                get_ready();
//            }
//         }
//    }
//    xhr.send(data);
//}