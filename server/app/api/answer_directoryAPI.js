/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/ 

var answerDirectoryDAO = require('../DAO/answer_directoryDAO');
var answerDAO = require('../DAO/answerDAO');
var error = require('../error/error');
var api = {}

//<--------------------------------- SELECT ------------------------------------>
//SELECT THE ANSWER_DIRECTORY BY ID
api.selectRootDirectories = function (req, res) {
	var projectId = req.params['projectId'];
	answerDirectoryDAO.selectAnswerDirectoryByParentId(projectId, function (err, answerDirectories){
		if (!err && (!answerDirectories || !answerDirectories.length)) {
			err = {"status": 204};
		}
		error.responseReturnXHR(res, err, answerDirectories);
	});
};

api.selectDirectoryContent = function (req, res) {
	var parentId = req.params['id'];
	var projectId = req.params['projectId'];

	answerDirectoryDAO.selectAnswerDirectoryByParentId(projectId, parentId, function (err, answerDirectories){
		if (err) {
			return error.responseReturnXHR(res, err);
		}

		answerDAO.selectAnswerByDirectory(parentId, function(err, answers) {
			if (err) {
				return error.responseReturnXHR(res, err);
			}
			error.responseReturnXHR(res, err, {
				'answers':answers,
				'directories':answerDirectories
			});
		});
	});
};

//<--------------------------------- INSERT ----------------------------------->

//CREATE ANSWER_DIRECTORY
api.createAnswerDirectory = function (req, res) {
	var answerdirectory = req.body;
	var projectId = req.params['projectId'];
	answerdirectory.projectId = projectId;
	answerdirectory.removed = 0;

	if (!answerdirectory.name)
		return res.status(400).end('{"message":"Nome da pasta deve ser fornecido"}'); //TODO: internacionalizar erros
	

	answerDirectoryDAO.selectCountByName(projectId, answerdirectory.name, false, function(err, count){
		if (err)
			return error.responseReturnXHR(res, err);
		
		if (count > 0)
			return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"Já existe uma pasta com o nome fornecido"}}); //TODO: internacionalizar erros
		
		answerDirectoryDAO.insert(answerdirectory, function (err){
			error.responseReturnXHR(res, err);
		});
	});
};

//<--------------------------------- UPDATE ------------------------------------>

//UPDATE NAME OF ANSWER_DIRECTORY 
api.updateAnswerDirectory = function (req, res) {
	var answerdirectory = req.body;
	answerdirectory.id = req.params['id'];
	answerdirectory.projectId = req.params['projectId'];

	if (!answerdirectory.name) {
		return res.status(400).end('{"message":"Nome da pasta deve ser fornecido"}'); //TODO: internacionalizar erros
	}

	answerDirectoryDAO.selectCountByName(answerdirectory.projectId, answerdirectory.name, answerdirectory.id, function(err, count){
		if (err) {
			return error.responseReturnXHR(res, err);
		}

		if (count > 0) {
			return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"Já existe uma pasta com o nome fornecido"}}); //TODO: internacionalizar erros
		}
		
		answerDirectoryDAO.update(answerdirectory, function (err) {
			error.responseReturnXHR(res, err);
		});
	});
};

//<--------------------------------- DELETE ------------------------------------>

function removeAnswerDirectoryAndChilds(res, ids, visit) {
	if (!ids.push) { ids = [ids]; }
	if (!visit) { visit = ids; }
	answerDirectoryDAO.selectAnswerDirectoryByParentId(null, visit, function(err, childFolder){
		if (err) { return error.responseReturnXHR(res, err); }
		var arr = [];
		for (i in childFolder) {
			arr.push(childFolder[i].id+'');
		}
		ids = ids.concat(arr);		
		if (arr && arr.length) {
			removeAnswerDirectoryAndChilds(res, ids, arr);
		} else {
			answerDAO.updateActiveGroup(null, ids, null, 0, function(err) {
				if (err) { return error.responseReturnXHR(res, err); }
				answerDirectoryDAO.updateRemoved(ids, 1, function(err) {
					if (err) { return error.responseReturnXHR(res, err); }
					error.responseReturnXHR(res, err);
				});
			});
		}
	});
}

//DELETE ANSWER_DIRECTORY
api.deleteAnswerDirectory = function (req, res) {
	var id = req.params['id'];
	if (!id) {
		return error.responseReturnXHR(res, {"status": 400, "returnObj":{"message":"ID deve ser fornecido"}});
	}
	removeAnswerDirectoryAndChilds(res, id);
};

module.exports = api;
