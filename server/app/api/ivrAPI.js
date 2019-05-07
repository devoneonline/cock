/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/

var sqlUtil = require('../sql-util');
var error = require('../error/error');

var api = {}

global.humanRedirect = 'NONE';

api.humanRedirectOpen = function (req, res) {
	var phoneNumber = req.params['phoneNumber'];
	global.humanRedirect = phoneNumber;
	res.end('OK');
};

api.humanRedirectClose = function (req, res) {
	global.humanRedirect = 'NONE';
	res.end('OK');
};

api.hasRedirection = function (req, res) {
	error.responseReturnXHR(res, null, global.humanRedirect);
};

api.projects = function(req, res) {
	var sqlMapSelect = {
		"table": "project p, channel c",
		"fields": ['p.id as projectId', 'p.name as projectName', 'c.id as channelId', 'c.name as channelName']
	};

	sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
		error.responseReturnXHR(res, err, rows);
	});
}

module.exports = api;
