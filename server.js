//requiero la libreria express
var express = require("express");
//almaceno en una variable la llamada al metodo express
var app = express();
//requiero la libreria http al que le añado el servidor de la app
var http = require("http").Server(app);
//requiero la libreria socket.io al que le añado la variable que almacena la libreria http
var io = require("socket.io")(http);

//requiero libreria delivery
var del = require("delivery");

//requiero libreria fs
var fs = require("fs");

//requerir libreria socket.io-stream
var ss = require("socket.io-stream");

//requerir libreria path
var path = require("path");

//Hago uso del directorio public del proyecto
app.use(express.static("public"));


//en la ruta /chat envio el archivo index.html
app.get("/chat",function(peticion,respuesta){
    respuesta.sendFile(__dirname+"/public/index.html");
});

app.get("/delivery/delivery.js",function(peticion,respuesta){
   respuesta.sendFile(__dirname+"/delivery/lib/client/delivery.js");
});

app.get("/visualizar",function(peticion,respuesta){
  respuesta.sendFile(__dirname+"/public/client-videoconf.html");
});

app.get("/rooms/:id",function(peticion,respuesta){
  respuesta.sendFile(__dirname+"/public/room.html");
  console.log(peticion.params.id);
});

app.get("/videoconferencia",function(peticion,respuesta){
  respuesta.sendFile(__dirname+"/public/videoconferencia.html");
});

//establecer conexion con el servidor mediante socket
io.on("connection",function(socket){
  console.log("usuario conectado");

  //crear evento nick
  socket.on("nick",function(data){
    console.log("El usuario "+data+" ha entrado al chat");
    socket.nick = data;
    io.sockets.emit("nick",data);
  });

  //crear evento message
  socket.on("message",function(data){
      console.log("mensaje "+data);
      if(socket.nick == undefined){
        socket.nick = "usuarioChat"+Math.round(Math.random()*10+1);
      }
      io.sockets.emit("message",socket.nick+" dice: "+data);
  });

  //crear evento estado
  socket.on("estado",function(data){
    io.sockets.emit("estado",data);
  });

  //crear evento avatar
  socket.on("avatar",function(data){
    io.sockets.emit("avatar",data);
  });

  //crear evento online para mostrar quien esta disponible
  socket.on("online",function(data){
    io.sockets.emit("online",data);
  });

  //crear evento escribir
  socket.on("escribir",function(){
    console.log(socket.nick);
    socket.broadcast.emit("escribir",socket.nick);
  });

  socket.on("user-image",function(data){    
    io.sockets.emit("user-image",data);
  });

  socket.on("emoticon",function(data){
    console.log("emoticono");
    io.sockets.emit("emoticon",socket.nick+" dice: "+data);
  });

  socket.on('stream',function(data){
    io.sockets.emit("stream",data);
  }); 
      
  //crear evento disconnect para cerrar conexion y saber quien se va del chat
  socket.on("disconnect",function(){
    console.log("usuario desconectado");
    io.sockets.emit("disc",socket.nick);
  });
});

//pongo el servidor a escuchar en el puerto 8080 o en algun otro puerto libre
http.listen(process.env.PORT || "8080",function(){
    console.log("Aplicacion escuchando en puerto 8080");
});
