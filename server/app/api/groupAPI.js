/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var groupDAO = require('../DAO/groupDAO');
var error = require('../error/error');

var api = {};


//<--------------------------------- SELECT ------------------------------------>


//SELECT ALL GROUPS
api.selectAllGroups = function (req, res) {
	groupDAO.select(function (err, group) {
		error.responseReturnXHR(res, err, group);
	});
};



//SELECT THE GROUP BY ID
api.selectGroupById = function (req, res) {
	var id = req.params['id'];

	if (!id)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"ID deve ser fornecido"}});

	groupDAO.selectGroupById(id, function (err,group){
		if (!err && !group)
			err = {
				"status": 204
			};
		error.responseReturnXHR(res, err, group);
	});
};





//<--------------------------------- INSERT ------------------------------------>


//CREATE GROUP USER
api.createGroup = function (req, res) {
	var group = req.body;

	if (!group.name)
		return res.status(400).end('{"message":"Nome do grupo deve ser fornecido"}'); //TODO: internacionalizar erros


	groupDAO.selectCountByName(group.name, false, function(err, count){
		if (err)
			return error.responseReturnXHR(res, err);
		
		if (count > 0)
			return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"Já existe um grupo com o nome fornecido"}}); //TODO: internacionalizar erros
		
		groupDAO.insert(group, function (err){
			error.responseReturnXHR(res, err);
		});
	});
};








//<--------------------------------- UPDATE ------------------------------------>


//UPDATE NAME OF GROUP_USER
api.updateGroup = function (req, res) {
	var group = req.body;
	group.id = req.params['id'];

	if (!group.name)
		return res.status(400).end('{"message":"Nome do grupo deve ser fornecido"}'); //TODO: internacionalizar erros

	groupDAO.selectCountByName(group.name, group.id, function(err, count){
		if (err)
			return error.responseReturnXHR(res, err);

		if (count > 0)
			return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"Já existe um grupo com o nome fornecido"}}); //TODO: internacionalizar erros
		
		groupDAO.update(group, function (err) {
			error.responseReturnXHR(res, err);
		});
	});
};





//<--------------------------------- DELETE ------------------------------------>


//DELETE GROUP
api.deleteGroup = function (req, res) {
	var id = req.params['id'];
	if (!id)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"ID deve ser fornecido"}});

	groupDAO.delete(id, function (err){
		error.responseReturnXHR(res, err);
	});
};



module.exports = api;