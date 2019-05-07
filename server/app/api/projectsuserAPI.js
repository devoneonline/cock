/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var projectUserDAO = require('../DAO/projectsuserDAO');
var error = require('../error/error');

var api = {}




//<--------------------------------- SELECT ------------------------------------>


//SELECT ALL PROJECT USER
api.selectAllProjectUser = function (req, res) {
	projectUserDAO.select(function (err, group) {
		error.responseReturnXHR(res, err, group);
	});
};



//SELECT THE GROUP BY ID
api.selectProjectUserById = function (req, res) {
	
    var id = req.params['id'];

	if (!id)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"ID deve ser fornecido"}});

	projectUserDAO.selectProjectUserByProjectId(id, function (err,group){
		if (!err && !group)
			err = {
				"status": 204
			};
		error.responseReturnXHR(res, err, group);
	});
};





//<--------------------------------- INSERT ------------------------------------>
  

//CREATE GROUP USER
api.createProjectUser = function (req, res) {
	var group = req.body;


	if (!group.projectId)
		return res.status(400).end('{"message":"Nome do projeto user deve ser fornecido"}'); //TODO: internacionalizar erros

	if (!group.userId)
		return res.status(400).end('{"message":"Nome do projeto user deve ser fornecido"}'); //TODO: internacionalizar erros


	projectUserDAO.insert(group, function (err){
		error.responseReturnXHR(res, err);
	});
	
};





//<--------------------------------- UPDATE ------------------------------------>


//UPDATE NAME OF GROUP_USER
api.updateProjectUser = function (req, res) {
	var group = req.body;
	group.projectIdKey = req.params['projectIdKey'];
    group.userIdKey = req.params['userIdKey'];


	if (!group.projectId)
		return res.status(400).end('{"message":"projectId deve ser fornecido"}'); //TODO: internacionalizar erros

	if (!group.userId)
		return res.status(400).end('{"message":"userId deve ser fornecido"}'); //TODO: internacionalizar erros

	projectUserDAO.update(group, function (err) {
			error.responseReturnXHR(res, err);
	});

};





//<--------------------------------- DELETE ------------------------------------>


//DELETE GROUP
api.deleteProjectUser = function (req, res) {
	var group = {
        "projectIdKey":req.params['projectIdKey'],
        "userIdKey":req.params['userIdKey']
    };

	if (!group.projectIdKey)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"projectId ID deve ser fornecido"}});

	if (!group.userIdKey)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"userId deve ser fornecido"}});


	projectUserDAO.delete(group, function (err){
		error.responseReturnXHR(res, err);
	});



};















module.exports = api;


