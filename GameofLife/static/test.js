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
    else {
        console.log("white");
        ctx.fillStyle = "white";
        ctx.fillRect(x*10+1, y*10+1, 9, 9);
    }
}

function sock(){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/course', true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    data = {"":""}
    data = JSON.stringify(data);
    xhr.onload = function(e){
      if (xhr.status != 200) {
        console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
      } else {
            var data = JSON.parse(xhr.responseText);
            if(data.new_world != ""){
                mas = data.new_world
                for(var i = 1; i < 6; i++) {
                    for(var j = 1; j < 6; j++) {
                            console.log(i,j);
                            drawField(mas[i][j], i , j);
                    }
                }
            }
            else{
            console.log("fff")
            }
        }
    }
    xhr.send(data);
}