/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/

var projectDAO = require('../DAO/projectDAO');
var error = require('../error/error');
var configurationDAO = require('../DAO/configurationDAO');
var api = {};

//<--------------------------------- SELECT ------------------------------------>

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

//SELECT ALL PROJECT
api.selectUserProjects = function (req, res) {
	if (req.user.statusAdmin == '1') {
		projectDAO.select(function (err, projects) {
		// for(proj of projects) {
			// 	if (proj.image) {
				// 		var image = new Buffer(proj.image, 'binary').toString('base64');
				// 		proj.image = proj.contentType+image;
				// 	}
				// }
				// err
			error.responseReturnXHR(res, err, projects);
		});
	} else {
		projectDAO.selectProjectsByUser(req.user.id, function (err, projects) {
			// for(proj of projects) {
			// 	if (proj.image) {
			// 		var image = new Buffer(proj.image, 'binary').toString('base64');
			// 		proj.image = proj.contentType+image;
			// 	}
			// }
			// err
			error.responseReturnXHR(res, err, projects);
		});
	}
};

api.selectProjectImage = function(req, res) {
	console.log(req.params['id']);
	projectDAO.selectImageById(req.params['id'], function(err, proj) {
		if (err) {
			return res.status(500).end();
		} else if (!proj) {
			return res.status(204).end();
		}
		
		res.writeHead(200, {'Content-Type': proj.contentType });
		res.end(proj.image, 'binary');
	});
};

//SELECT THE PROJECT BY USER

api.selectProjectsByUserId = function (req,res){
	var userid = req.params['userid'];

	if (!userid) {
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"userId deve ser fornecido"}});
	}

	projectDAO.selectProjectsByUser(userid,function (err,channel){
		if (!err && !channel) {
			err = {"status": 204};
		}
		error.responseReturnXHR(res, err, channel);
	});
}

//SELECT THE PROJECT BY ID
api.selectProjectById = function (req, res) {
	var id = req.params['id'];

	if (!id) {
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"ID deve ser fornecido"}});
	}

	projectDAO.selectProjectById(id, function (err,channel){
		if (!err && !channel)
			err = {
				"status": 204
			};
		error.responseReturnXHR(res, err, channel);
	});
};

//<--------------------------------- INSERT ----------------------------------->

function errorMsgInvalidFields(project) {
	if (!project.name) {
		return '{"message":"Nome do projeto deve ser fornecido."}';
	} else if (!project.locale) {
		return '{"message":"Idioma do projeto deve ser fornecido."}';
	} else if (!project.nlp || project.nlp == '') {
		return '{"message":"NLP do projeto deve ser selecionado."}';
	} else {
		// if (project.nlp==1) { //clever
		// 	if (!project.metadata.cleverUrl) {
		// 		return '{"message":"Url do projeto deve ser fornecido."}';
		// 	}
		// } else 
		if (project.nlp==2) { //luis
			if (!project.metadata.suscriptionKey) {
				return '{"message":"Key String do projeto deve ser fornecido."}';
			} else if (!project.metadata.url) {
				return '{"message":"Url do projeto deve ser fornecido."}';
			} else if (!project.metadata.workspaceId) {
				return '{"message":"ID da Aplicação do projeto deve ser fornecid0."}';
			}
		} else if (project.nlp==3) { //watson
			if (!project.metadata.workspaceUrl) {
				return '{"message":"ID do Workspace do projeto deve ser fornecido."}';
			} else if (!project.metadata.workspaceUsername) {
				return '{"message":"Username do projeto deve ser fornecido."}';
			} else if (!project.metadata.workspacePassword) {
				return '{"message":"Password do projeto deve ser fornecid0."}';
			}
		} else {
			// todo
			// if (!project.metadata.accessToken) {
			// 	return '{"message":"Url do projeto deve ser fornecido."}';
			// }
		}
	}
	return false;
}

//CREATE PROJECT
api.createProject = function (req, res) {
	var project = req.body;
	console.log('project: ', project);
	var errMsgInvalidFields = errorMsgInvalidFields(project);
	if (errMsgInvalidFields) {
		return res.status(400).end(errMsgInvalidFields);
	}

	projectDAO.selectCountByName(project.name, false, function(err, count){
		if (err) {
			return error.responseReturnXHR(res, err);
		} else if (count > 0) {
			return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"Já existe um projeto com o nome fornecido"}}); //TODO: internacionalizar erros
		}
		
		if (project.image) {
			project.image = Buffer.from(project.image, "base64");
		}

		configurationDAO.selectConfigurationByConfigKey("clever.url", function(err, config){
			if (err) {
				return error.responseReturnXHR(res, err);
			}
			// let cleverUrl = config["configValue"];
			let nlpInsertContent = {};
			if(project.dialogflow){
				nlpInsertContent = project.jsonmetadata;
			} else if(project.clever){
				// project.metadata= '{"cleverUrl":' + '" '+ cleverUrl +' "}';
				project.metadata= '{"cleverUrl":' + '" '+ cleverUrl +' ", "lang":' + '" '+ project.locale +' " }';
				nlpInsertContent= project.metadata;
			}else{
				nlpInsertContent = JSON.stringify(project.metadata);
			}	

			projectDAO.insert(project, req.user.name, nlpInsertContent, function (err){
				if (err) {
					return error.responseReturnXHR(res, err);
				}

				projectDAO.selectIdByName(project.name, function(err, id) {
					if (err) {
						return error.responseReturnXHR(res, err);
					}

					req.user.projects.push({'id': id, 'name': project.name});				
					error.responseReturnXHR(res, err);
				});

			});
		});
	});
};

//<--------------------------------- UPDATE ------------------------------------>

//UPDATE NAME OF PROJECT
api.updateProject = function (req, res) {
	var project = req.body;
	project.id = req.params['id'];

	var errMsgInvalidFields = errorMsgInvalidFields(project);
	if (errMsgInvalidFields) {
		return res.status(400).end(errMsgInvalidFields);
	}

	projectDAO.selectCountByName(project.name, project.id, function(err, count){
		if (err) {
			return error.responseReturnXHR(res, err);
		}

		if (count > 0) {
			return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"Já existe um projeto com o nome fornecido"}});
		}
		
		if (project.image) {
			project.image = Buffer.from(project.image, "base64");
		}

		let nlpInsertContent = {};
		configurationDAO.selectConfigurationByConfigKey("clever.url", function(err, config){
			let cleverUrl = config["configValue"];
			if(project.dialogflow){
				nlpInsertContent = project.jsonmetadata;
			} else if(project.clever){
				// project.metadata= '{"cleverUrl":' + '" '+ cleverUrl +' "}';
				project.metadata= '{"cleverUrl":' + '" '+ cleverUrl +' ", "lang":' + '" '+ project.locale +' " }';
				nlpInsertContent = project.metadata;
			}else{
				nlpInsertContent = JSON.stringify(project.metadata);
			}
		// console.log('nlpInsertContet: ', nlpInsertContent);

			projectDAO.selectChatbase(project.id, (err, count) => {
				if (err) return error.responseReturnXHR(res, err);
				if (count || !project.api_key) {
					projectDAO.update(project, nlpInsertContent, req.user.name, function (err) {
						error.responseReturnXHR(res, err);
					});
				} else {
					projectDAO.insertChatbase(project.name, project.api_key, project.id, (err) => {
						if (err) return error.responseReturnXHR(res, err);
						projectDAO.update(project, nlpInsertContent, req.user.name, function (err) {
							error.responseReturnXHR(res, err);
						});
					});
				}
			})
		});
	});
};

//<--------------------------------- DELETE ------------------------------------>

//DELETE CHANNEL
api.deleteProject = function (req, res) {
	var id = req.params['id'];
	if (!id)
		return error.responseReturnXHR(res, {"status": 400, "returnObj":{"message":"ID deve ser fornecido"}});
	
	projectDAO.updateToRemove(id, (err) => {
		error.responseReturnXHR(res, err);
	});
	// projectDAO.delete(id, function (err){
	// 	error.responseReturnXHR(res, err);
	// });

};

module.exports = api;
