/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/

//var config = require('./db-config-true/db-config')
var config = require('./db-config');
var mysql = require("mysql");

var pool = mysql.createPool({
	port:config.prod.port,
    host:config.prod.host,
    user:config.prod.user,
    password :config.prod.pass,
    database:config.prod.database,
    ssl: config.prod.ssl
});

global.connectionPool = pool;

var poold1 = mysql.createPool({
	port:config.d1.port,
    host:config.d1.host,
    user:config.d1.user,
    password :config.d1.pass,
    database:config.d1.database,
    ssl: config.d1.ssl
});

global.connectionPoolD1 = poold1;