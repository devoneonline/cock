/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var configurationDAO = require('../DAO/configurationDAO');
var error = require('../error/error');
const fs = require('fs');
const json = JSON.parse(fs.readFileSync('package.json', 'utf8'));

var api = {}



//<--------------------------------- SELECT ------------------------------------>
//SELECT ALL ANSWER STATUSES
api.selectAllConfigurations = function (req, res) {
	configurationDAO.select(function (err, statuses) {
		error.responseReturnXHR(res, err, statuses);
	});
};

api.selectVersion = (req, res) => res.json({ version: json.version });


//<--------------------------------- INSERT ------------------------------------>
//CREATE CHANNEL
api.createConfiguration = function (req, res) {
	var configuration = req.body;

	if (!configuration.configKey)
		return res.status(400).end('{"message":"Chave deve ser fornecida"}'); //TODO: internacionalizar erros

	configurationDAO.selectConfigurationByConfigKey(configuration.configKey, function(err, hasConfig){
		if (err)
			return error.responseReturnXHR(res, err);
		
		if (hasConfig)
			return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"Já existe um parâmetro com a chave fornecido"}}); //TODO: internacionalizar erros
		
		configurationDAO.insert(configuration, function (err){
			error.responseReturnXHR(res, err);
		});
	});
};


//<--------------------------------- UPDATE ------------------------------------>
api.updateConfiguration = function (req, res) {
	var configuration = req.body;
	var oldKey = req.params['configKey'];

	if (!configuration.configKey)
		return res.status(400).end('{"message":"Chave deve ser fornecida"}'); //TODO: internacionalizar erros

	configurationDAO.selectConfigurationByConfigKey(oldKey, function(err, configFound){
		if (err)
			return error.responseReturnXHR(res, err);

		if (configFound){
			// return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"Já existe um parâmetro com a chave fornecida"}}); //TODO: internacionalizar erros
			
			configurationDAO.update(oldKey, configuration, function (err) {
				error.responseReturnXHR(res, err);
			});
		}
	});
};



//<--------------------------------- DELETE ------------------------------------>


//DELETE CHANNEL
api.deleteConfiguration = function (req, res) {
	var oldKey = req.params['configKey'];
	if (!oldKey)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"Chave deve ser fornecida"}});

	configurationDAO.delete(oldKey, function (err){
		error.responseReturnXHR(res, err);
	});
};



module.exports = api;