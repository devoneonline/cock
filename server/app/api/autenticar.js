/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/ 

var sqlUtil = require('../sql-util');
var bcrypt = require('bcrypt-nodejs');
 
var api = {}



api.autenticacao = function(req, res) {
  res.send('autenticação');

        
};


module.exports = api;