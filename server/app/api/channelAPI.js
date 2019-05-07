/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/

var channelDAO = require('../DAO/channelDAO');
var error = require('../error/error');

var api = {}

//<--------------------------------- SELECT ------------------------------------>


//SELECT ALL CHANNELS
api.selectAllChannels = function (req, res) {
	var projectId = req.params["projectId"];
	channelDAO.select(projectId, function (err, channels) {
		error.responseReturnXHR(res, err, channels);
	});
};



//SELECT THE CHANNEL BY ID
api.selectChannelById = function (req, res) {
	var id = req.params['id'];
	var projectId = req.params["projectId"];

	if (!id)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"ID deve ser fornecido"}});

	channelDAO.selectChannelById(projectId, id, function (err,channel){
		if (!err && !channel)
			err = {
				"status": 204
			};
		error.responseReturnXHR(res, err, channel);
	});
};




//<--------------------------------- INSERT ------------------------------------>


//CREATE CHANNEL
api.createChannel = function (req, res) {
	var channel = req.body;
	var projectId = req.params["projectId"];
	channel.projectId = projectId;
	let systemName = '';

	let characterValidation = /[^\a-zA-Zá-úÁ-Úà-ùÁ-Ùê-ûÂ-Û0-9\&\(\)\-\_ ]/g; // selects everything that it's not letters, numbers, &, (), -, _

	if (!channel.name)
		return res.status(400).end('{"message":"CHANNEL.INFORM-NAME"}');
	if (!channel.projectId)
		return res.status(400).end('{"message":"CHANNEL.INFORM-PROJECT"}');
	if (!channel.classificationId)
		return res.status(400).end('{"message":"CHANNEL.INFORM-CLASSIFICATION"}');
	if(characterValidation.test(channel.name))
		return res.status(400).end('{"message":"CHARACTER-VALIDATION"}');

	
	function clearAccents (s) {

		let isUpperCase = false;
		s == s.toUpperCase() ? isUpperCase = true : isUpperCase = false;
		var r=s.toLowerCase();
		r = r.replace(new RegExp(/\s/g),"");
		r = r.replace(new RegExp(/[àáâãäå]/g),"a");
		r = r.replace(new RegExp(/æ/g),"ae");
		r = r.replace(new RegExp(/ç/g),"c");
		r = r.replace(new RegExp(/[èéêë]/g),"e");
		r = r.replace(new RegExp(/[ìíîï]/g),"i");
		r = r.replace(new RegExp(/ñ/g),"n");                
		r = r.replace(new RegExp(/[òóôõö]/g),"o");
		r = r.replace(new RegExp(/œ/g),"oe");
		r = r.replace(new RegExp(/[ùúûü]/g),"u");
		r = r.replace(new RegExp(/[ýÿ]/g),"y");
		r = r.replace(/[\(\)\&]/g,'_');
		r = r.replace(/[ ]/g,'');

		isUpperCase ? r = r.toUpperCase() : r;
		systemName += r;
	};

	for(let i = 0; i < channel.name.length; i++) {
		clearAccents(channel.name[i]);
	}

	channelDAO.selectCountByName(channel.name, channel.projectId, 0, function(err, count){
		if (err)
			return error.responseReturnXHR(res, err);
		
		if (count > 0)
			return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"CHANNEL.NAME-ALREADY-EXISTS"}});
		
		channelDAO.selectCountBySystemName(systemName, channel.projectId, 0, function(err, count) {
			if (err)
				return error.responseReturnXHR(res, err);
		
			if (count > 0)
				return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"CHANNEL.SYSTEM-NAME-ALREADY-EXISTS-ADD"}});
		

			channelDAO.insert(channel, req.user.name, systemName, function (err){
				error.responseReturnXHR(res, err);
			});
		});

	});
};


//<--------------------------------- UPDATE ------------------------------------>
api.updateChannel = function (req, res) {
	var channel = req.body;
	console.log('channel: ', channel);
	channel.id = req.params['id'];
	var projectId = req.params["projectId"];
	channel.projectId = projectId;
	let systemName = '';

	let characterValidation = /[^\a-zA-Zá-úÁ-Úà-ùÁ-Ùê-ûÂ-Û0-9\&\(\)\-\_ ]/g; // selects everything that it's not letters, numbers, &, (), -, _

	if (!channel.name)
		return res.status(400).end('{"message":"CHANNEL.INFORM-NAME"}');
	if (!channel.projectId)
		return res.status(400).end('{"message":"CHANNEL.INFORM-PROJECT"}');
	if (!channel.classificationId)
		return res.status(400).end('{"message":"CHANNEL.INFORM-CLASSIFICATION"}');

	if(characterValidation.test(channel.name))
		return res.status(400).end('{"message":"CHARACTER-VALIDATION"}');

	function clearAccents (s) {

		let isUpperCase = false;
		s == s.toUpperCase() ? isUpperCase = true : isUpperCase = false;
		var r=s.toLowerCase();
		r = r.replace(new RegExp(/\s/g),"");
		r = r.replace(new RegExp(/[àáâãäå]/g),"a");
		r = r.replace(new RegExp(/æ/g),"ae");
		r = r.replace(new RegExp(/ç/g),"c");
		r = r.replace(new RegExp(/[èéêë]/g),"e");
		r = r.replace(new RegExp(/[ìíîï]/g),"i");
		r = r.replace(new RegExp(/ñ/g),"n");                
		r = r.replace(new RegExp(/[òóôõö]/g),"o");
		r = r.replace(new RegExp(/œ/g),"oe");
		r = r.replace(new RegExp(/[ùúûü]/g),"u");
		r = r.replace(new RegExp(/[ýÿ]/g),"y");
		r = r.replace(/[\(\)\&]/g,'_');
		r = r.replace(new RegExp(/[ ]/g),"");

		isUpperCase ? r = r.toUpperCase() : r;
		systemName += r;
	};

	for(let i = 0; i < channel.name.length; i++) {
		clearAccents(channel.name[i]);
	}

	channelDAO.selectCountByName(channel.name, channel.projectId, channel.id, function(err, count){
		if (err)
			return error.responseReturnXHR(res, err);

		if (count > 0)
			return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"CHANNEL.NAME-ALREADY-EXISTS"}}); //TODO: internacionalizar erros
		

		channelDAO.selectCountBySystemName(systemName, channel.projectId, channel.id, function(err, count) {
			if (err)
				return error.responseReturnXHR(res, err);
		
			if (count > 0)
				return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"CHANNEL.SYSTEM-NAME-ALREADY-EXISTS-EDIT"}}); //TODO: internacionalizar erros
		

			channelDAO.update(channel, req.user.name, systemName, function (err) {
				error.responseReturnXHR(res, err);
			});
		});
	});
};



//<--------------------------------- DELETE ------------------------------------>


//DELETE CHANNEL
api.deleteChannel = function (req, res) {
	var id = req.params['id'];
	var projectId = req.params["projectId"];
	if (!id)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"ID deve ser fornecido"}});

	channelDAO.delete(projectId, id, function (err){
		error.responseReturnXHR(res, err);
	});
};





module.exports = api;