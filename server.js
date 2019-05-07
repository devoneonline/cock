/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/

/*  var app = require('./server/config/express');
var http = require('http');
 var fs = require('fs');

 var bcrypt = require('bcrypt-nodejs');
 var winston = require('winston');

 require('./server/app/db/pool');


 var httpsoptions = {
     pfx: fs.readFileSync('./server.pfx'),
     passphrase: 'vivi'
 };


 http.createServer(app)
 .listen(process.env.PORT || 4000, function() {
 	console.log('Servidor iniciado');
 });
 */

 
var app = require('./server/config/express');
var cockpitWebSocket = require('./server/config/cockpitWebSocket');
const WebSocketServer = require('./node_modules/websocket').server;

var http = require('http');
var fs = require('fs');

var bcrypt = require('bcrypt-nodejs');
var winston = require('winston');

require('./server/app/db/pool');

var httpsoptions = {
   pfx: fs.readFileSync('./server.pfx'),
   passphrase: 'vivi'
};

//Configurando servidor HTTP na porta 3000
var server = http.createServer(app)
.listen(process.env.PORT || 3000, function() {
	console.log('Servidor iniciado');
});

//Configurando servidor WebSocket tambem na porta 3000
var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false //VER ISSO ANTES DE PROD
});
wsServer.on('request', cockpitWebSocket.handleWSConnection );