/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var os = require('os');
module.exports = function (http) {
	var opt = {
		'hostname':'devtrace.mybluemix.net',
		'path':'/dev/tracelog',
		'method':'POST',
		'headers': {
			'Content-type':'application/json',
			'Accept':'*/*'
		}
	};
};