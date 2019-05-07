/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/ 

var answerStatusDAO = require('../DAO/answerStatusDAO');
var error = require('../error/error');

var api = {}



//<--------------------------------- SELECT ------------------------------------>
//SELECT ALL ANSWER STATUSES
api.selectAllAnswerStatus = function (req, res) {
	answerStatusDAO.select(function (err, statuses) {
		error.responseReturnXHR(res, err, statuses);
	});
};


//<--------------------------------- INSERT ------------------------------------>
//CREATE CHANNEL
api.createAnswerStatus = function (req, res) {
	var answerStatus = req.body;

	if (!answerStatus.name)
		return res.status(400).end('{"message":"Nome deve ser fornecido"}'); //TODO: internacionalizar erros

	answerStatusDAO.selectAnswerStatusByName(answerStatus.name, null, function(err, hasAnswerStatus){
		if (err)
			return error.responseReturnXHR(res, err);
		
		if (hasAnswerStatus)
			return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"Já existe um status com o nome fornecido"}}); //TODO: internacionalizar erros
		
		if (!answerStatus.defaultStatus) {
			answerStatusDAO.insert(answerStatus, function (err){
				error.responseReturnXHR(res, err);
			});
		} else {
			answerStatusDAO.removeDefault(function(err) {
				if (err)
					return error.responseReturnXHR(res, err);
				
				answerStatusDAO.insert(answerStatus, function (err){
					error.responseReturnXHR(res, err);
				});
			});
		}
	});
};


//<--------------------------------- UPDATE ------------------------------------>
api.updateAnswerStatus = function (req, res) {
	var answerStatus = req.body;
	answerStatus.id = req.params['id'];

	if (!answerStatus.name)
		return res.status(400).end('{"message":"Nome do status deve ser fornecido"}'); //TODO: internacionalizar erros

	answerStatusDAO.selectAnswerStatusByName(answerStatus.name, answerStatus.id, function(err, answerStatusFound){
		if (err)
			return error.responseReturnXHR(res, err);

		if (answerStatusFound && answerStatusFound.id != answerStatus.id)
			return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"Já existe um status com o nome fornecido"}}); //TODO: internacionalizar erros
		
		if (!answerStatus.defaultStatus) {
			answerStatusDAO.update(answerStatus, function (err) {
				error.responseReturnXHR(res, err);
			});
		} else {
			answerStatusDAO.selectDefaultStatus(answerStatus.id, function(err, as) {
				if (err)
					return error.responseReturnXHR(res, err);

				if (as && as.id != answerStatus.id) {
					answerStatusDAO.removeDefault(as.id, function(err) {
						if (err)
							return error.responseReturnXHR(res, err);
						
						answerStatusDAO.update(answerStatus, function (err){
							error.responseReturnXHR(res, err);
						});
					});
				} else {
					answerStatusDAO.update(answerStatus, function (err){
						error.responseReturnXHR(res, err);
					});
				}
			});
		}
	});
};



//<--------------------------------- DELETE ------------------------------------>


//DELETE CHANNEL
api.deleteAnswerStatus = function (req, res) {
	var id = req.params['id'];
	if (!id)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"ID deve ser fornecido"}});

	answerStatusDAO.delete(id, function (err){
		error.responseReturnXHR(res, err);
	});
};







module.exports = api;