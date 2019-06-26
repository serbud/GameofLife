function registr(mail, log, pass, pass2) {
  if(pass != pass2){ alert("Пароли не совпадают!") }
  else{
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/127.0.0.1:5000/POST_sign_up', true);
      data = {
        email: mail,
        login: log,
        password: pass,
      }
      data = JSON.stringify(data);
      xhr.onload = function(e){
          if (xhr.status != 200) {
            console.log( xhr.status + ': ' + xhr.statusText );
          } else {
            console.log( xhr.responseText );
            var data = JSON.parse(xhr.responseText);
          }
      }
      xhr.send(data);
  }
}