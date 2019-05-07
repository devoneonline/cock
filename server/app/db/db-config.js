/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
db = {};
var argv = require('minimist')(process.argv.slice(2));
if(argv.host == undefined){
  argv.port = null;
  argv.host = null;
  argv.user = null;
  argv.pass = null;
  argv.database = null;
}

if(argv.database == undefined){
  argv.database = null;
}


db.d1 = {
  port: '3306',
  host: '35.226.50.244',
  user: 'eva',
  pass: 'eva@2018',
  database: 'eva_homolog',
  connectionLimit: 3
  
}

db.prod = {
  port: argv.porta || '3306',
  host: argv.host || '35.226.50.244',
  user: argv.user || 'eva',
  pass: argv.pass || 'eva@2018',
  database: argv.database || 'eva_homolog' ,
  connectionLimit: 3
}
module.exports = db;
