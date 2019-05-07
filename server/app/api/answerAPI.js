/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/ 

var answerDAO = require('../DAO/answerDAO');
var error = require('../error/error');
var api = {}

//<--------------------------------- SELECT ------------------------------------>


//SELECT ALL DISCTINCT FAQ OF ANSWER
api.selectFaqOfAnswer = function (req, res) {
	var projectId = req.params["projectId"];
	if (!projectId)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"projectId deve ser fornecido"}});

	answerDAO.selectFaqOfAnswer(projectId, req.body.title, function (err, channels) {
		error.responseReturnXHR(res, err, channels);
	});
};

//SELECT ALL DISCTINCT CODE OF ANSWER
api.selectCodeOfAnswer = function (req, res) {
	var projectId = req.params["projectId"];
	if (!projectId)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"projectId deve ser fornecido"}});

	answerDAO.selectCodeOfAnswer(projectId, req.body.code, function (err, channels) {
		error.responseReturnXHR(res, err, channels);
	});
};

api.searchAnswers = function(req, res) {
	var projectId = req.params["projectId"];
	var filter  = req.body;

	if (!filter || (!filter.title && !filter.text && !filter.code && !filter.activeGroup)) {
		return error.responseReturnXHR(res, {
			status: 400,
			returnObj: "Nenhuma informação para filtro fornecida"
		});
	}

	answerDAO.searchAnswers(projectId, filter, function(err, answers) {
		error.responseReturnXHR(res, err, answers);
	});
}



//SELECT ANSWER BY DIRECTORY
api.selectAnswerByDirectory = function (req, res) {
	var directoryId = req.params.directoryId;
	var projectId = req.params.projectId;
	var locale = req.params.locale;
	
	if (!directoryId)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"directoryId deve ser fornecido"}});
	if (!projectId)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"projectId deve ser fornecido"}});
	if (!locale)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"locale deve ser fornecido"}});
	 
	 
	answerDAO.selectAnswerByDirectory(directoryId, projectId, locale, function (err,answer){
		if (!err && !answer)
			err = {
				"status": 204
			};
		error.responseReturnXHR(res, err, answer);
	});
};



//SELECT ANSWER BY CODE
api.selectAnswerByCode = function (req, res) {
	var code = req.params.code;
	var projectId = req.params.projectId;
	var locale = req.params.locale;

	if (!code)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"code deve ser fornecido"}});
	if (!projectId)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"projectId deve ser fornecido"}});
	if (!locale)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"locale deve ser fornecido"}});

	answerDAO.selectAnswerByCode(code, projectId, locale, function (err,answers){
		if (!err && !answers)
			err = {
				"status": 204
			};
		error.responseReturnXHR(res, err, answers);
	});
};



//<--------------------------------- INSERT/UPDATE ------------------------------------>
//CREATE/UPDATE ANSWER
api.processAnswers = function (req, res) {
	var answers = req.body;
	
	for (i in answers) {
		var answer = answers[i];
		if (!answer.code)
			return res.status(400).end('{"message":"Código deve ser fornecido"}'); //TODO: internacionalizar erros
		if (!answer.title)
			return res.status(400).end('{"message":"Título deve ser fornecido"}'); //TODO: internacionalizar erros
		if (!answer.locale)
			return res.status(400).end('{"message":"Idioma deve ser fornecido"}'); //TODO: internacionalizar erros
		if (!answer.projectId)
			return res.status(400).end('{"message":"Projeto deve ser fornecido"}'); //TODO: internacionalizar erros
		if (!answer.type)
			return res.status(400).end('{"message":"Tipo da respostas deve ser fornecido (PRE|POST|NONE)"}'); //TODO: internacionalizar erros
		if (!answer.directoryId)
			return res.status(400).end('{"message":"Diretório deve ser fornecido"}'); //TODO: internacionalizar erros
		if (answer.likeable === null || answer.likeable == undefined) 
			return res.status(400).end('{"message":"Likeable deve ser fornecido"}');
		if (answer.text){
			try{
				var values = {"title":[], "subtitle":[], "txt":[], "url":[]};
				var obj = answer.text.trim();
				obj = JSON.parse(obj);
				getJsonValues(obj, values);
				answer.link = JSON.stringify(values.url).replace(/\[|"|\]/g, '');
				if(answer.link)
					answer.textSimple = JSON.stringify(values.txt).replace(/\[|"|\]/g, '')  + ' links: ' + answer.link;
				else
					answer.textSimple = JSON.stringify(values.txt).replace(/\[|"|\]/g, '');
			}catch(e){
				// console.log(`
				
				// Texto: ${answer.text}
				// Erro: ${e}`
				// )
			}
			if(typeof(obj) != 'object'){
				answer.link = answer.text.replace(/(.|\r|\n)*?href="(.+?)"(.|\r|\n)*?/g, '$2###');
				answer.link = answer.link.substring(0, answer.link.lastIndexOf('###')).replace(/###/g,', ');
				answer.textSimple = answer.text.replace(/&(#[0-9]+|\w+);/g, ' ');
				if(answer.link)
					answer.textSimple = answer.textSimple.replace(/<.+?>|&(#[0-9]+|\w+);/g, '') + ' links: ' + answer.link;
				else
					answer.textSimple = answer.textSimple.replace(/<.+?>|&(#[0-9]+|\w+);/g, '');

				//remover depois talvez
				// answer.textSimple = answer.textSimple.replace(/\r|\n/g, '');
			}
		}

	}

	answerDAO.selectDuplicateAnswer(answers[0], function(err, hasAnswer){
		if (err) {
			return error.responseReturnXHR(res, err);
		}
		
		if (hasAnswer) {
			return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"Já existe um conteúdo com os dados de Código, Projeto, Canal e idioma fornecidos"}}); //TODO: internacionalizar erros
		}

		answerDAO.processAnswers(answers, req.user.name, function (err){
			error.responseReturnXHR(res, err);
		});
	});
};



//<--------------------------------- DELETE ------------------------------------>
//DELETE ANSWER
api.deleteAnswer = function (req, res) {
	var id = req.params['id'];
	if (!id)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"ID deve ser fornecido"}});

	answerDAO.delete(id, function (err){
		error.responseReturnXHR(res, err);
	});
};

api.deleteAnswersByCode = function(req, res) {
	var code = req.params.code;
	var projectId = req.params.projectId;
	var locale = req.params.locale;

	if (!code)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"code deve ser fornecido"}});
	if (!projectId)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"projectId deve ser fornecido"}});
	if (!locale)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"locale deve ser fornecido"}});

	answerDAO.deleteAnswerByCode(code, projectId, locale, function(err){
		error.responseReturnXHR(res, err);
	});
}

// Update answer activeGroup
api.updateActiveGroup = function(req, res) {
	var code = req.params['code'];
	var projectId = req.params['projectId'];
	var activeGroup = req.body.activeGroup;

	if(activeGroup) { activeGroup = false;
	} else { activeGroup = true; }

	if (!code) {
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"code deve ser fornecido"}});
	}
	if (!projectId) {
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"projectId deve ser fornecido"}});
	}
	
	answerDAO.updateActiveGroup(projectId, null, code, activeGroup, function(err){
		error.responseReturnXHR(res, err);
	});
}

//JSON CLEANER FACEBOOK PATTERN
function getJsonValues(obj, values) {
	for (var property in obj) {
		if (obj.hasOwnProperty(property)) {
			if (typeof obj[property] == "object") {
				getJsonValues(obj[property], values);
			} else {
				if(property == 'text')
					values.txt.push(obj[property]);
				if(property == 'title' || property == 'subtitle')
					values.title.push(obj[property]);
				// if(property == 'subtitle')
				// 	values.subtitle.push(obj[property]);
				if(property == 'url')
					values.url.push(obj[property]);
			}
		}
	}
}

//HTML CLEANER
function htmlCleaner(obj){

}

function getHrefValues(obj){
	
}

// EXPORT FUNCTION -- REFATORAR, SELECT CAMPO TEXT SIMPLE
api.exportAnswer = function(req, res){
	var projectId = req.params['projectId'],
		locale = req.params['locale'];

    var filters = {};

    filters.projectId = projectId;
	filters.locale = locale;

    if (req.query['title'])
        filters.title = req.query['title'];

    if (req.query['text'])
        filters.text = req.query['text'];

    answerDAO.exportAnswer(filters, function(err, answer){
        if(err) 
            return error.responseReturnXHR(res, err);
		
		for(i in answer){
			try{
				var values = {"title":[], "subtitle":[], "txt":[], "url":[]};
				var obj = answer[i].text.trim();
				obj = JSON.parse(obj);
				getJsonValues(obj, values);
				answer[i].title = JSON.stringify(values.title).replace(/\[|"|\]/g, '');
				answer[i].text = JSON.stringify(values.txt).replace(/\[|"|\]/g, '');
				answer[i].link = JSON.stringify(values.url).replace(/\[|"|\]/g, '');
			}catch(e){
				// console.log(`
				
				// Texto: ${answer[i].text}
				// Erro: ${e}`
				// )
			}
			if(typeof(obj) != 'object'){
				answer[i].link = answer[i].text.replace(/(.|\r|\n)*?href="(.+?)"(.|\r|\n)*?/g, '$2###');
				answer[i].link = answer[i].link.substring(0, answer[i].link.lastIndexOf('###')).replace(/###/g,', ');
				answer[i].text = answer[i].text.replace(/&(#[0-9]+|\w+);/g, ' ');
				answer[i].text = answer[i].text.replace(/<.+?>|&(#[0-9]+|\w+);/g, '');
				//remover depois
				// answer[i].text = answer[i].text.replace(/\r|\n/g, '');
				// answer[i].text = answer[i].text.replace(/\'/g, "\\'");
			}
		}
		res.xls('data.xlsx', answer);
        res.end();
    });
}

api.codesAndTitles = function(req, res) {
	answerDAO.codesAndTitles(function(err, rows) {
		error.responseReturnXHR(res, err, rows);
	});
}



module.exports = api;
