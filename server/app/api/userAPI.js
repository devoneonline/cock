/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var userDAO = require('../DAO/userDAO');
var error = require('../error/error');

var api = {}




//<--------------------------------- SELECT ------------------------------------>

//CHANGE PASSWORD
api.changePassword = function (req, res) {
	
	var oldPassword = req.body.oldPassword;
	var newPassword = req.body.newPassword;
	var email = req.body.email;
	var validateNewPassword = req.body.validateNewPassword;

	if(oldPassword == null || newPassword == null || validateNewPassword == null
		|| oldPassword == "" || newPassword == "" || validateNewPassword == ""
		|| oldPassword == undefined || newPassword == undefined || validateNewPassword == undefined){
		return res.status(400).end('{"message":"Todos os campos devem ser preenchidos."}');
	}
	if(newPassword != validateNewPassword) {
		// to do preciso resolver
		return res.status(400).end('{"message":"Senhas não conferem!"}');
	}
	
	var numbers = /[0-9]/;
	var letters = /[a-zA-Z]/;
	var characters = /[-!&_+@]/;

	if(!(newPassword.length >= 6)) {
		return res.status(400).end('{"message":"Senha dever ter no mínimo 6 caracteres"}');
	}
	
	if(letters.test(newPassword) && numbers.test(newPassword)
            || letters.test(newPassword) && characters.test(newPassword)
            || numbers.test(newPassword) && characters.test(newPassword)) {
		
	} else {
		return res.status(400).end('{"message":"erro"}');
	}
	
	userDAO.selectUserByEmail(email, function(err, userFound){
		if (err) {
			return error.responseReturnXHR(res, err);
		}
		// if (userFound && userFound.id != user.id) {
		// 	return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"Já existe um usuário com o email fornecido"}}); //TODO: internacionalizar erros
		// }

		console.log(oldPassword, userFound.validatePassword(oldPassword));
		if (!userFound.validatePassword(oldPassword)) {
			return error.responseReturnXHR(res, {"message":"Senha atual não confere."});
		}

		userFound["password"] = newPassword;
		userDAO.updatePass(userFound, function (err) {
			error.responseReturnXHR(res, err);
		});
	});

}

//SELECT ALL CHANNELS
api.selectAllUsers = function (req, res) {
	userDAO.select(function (err, users) {
		error.responseReturnXHR(res, err, users);
	});
};



//SELECT THE CHANNEL BY ID
api.selectUserById = function (req, res) {
	var id = req.params['id'];

	if (!id)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"ID deve ser fornecido"}});

	userDAO.selectUserById(id, function (err, user){
		if (!err && !user)
			err = {
				"status": 204
			};
		error.responseReturnXHR(res, err, user);
	});
};


//LOGIN USER
api.findUser = function(req, res) {
	var user = req.body;

	if (!user.email)
		return res.status(400).end('{"message":"email deve ser fornecido"}'); //TODO: internacionalizar erros
	if (!user.password)
		return res.status(400).end('{"message":"Password deve ser fornecido"}'); //TODO: internacionalizar erros

	userDAO.selectUserByPassword(user, function (err, user){
		if (!err && !user)
			err = {
				"status": 204
			};
		error.responseReturnXHR(res, err, user);
	});
};




//<--------------------------------- INSERT ------------------------------------>


//CREATE CHANNEL
api.createUser = function (req, res) {
	var user = req.body;

	if (!user.name)
		return res.status(400).end('{"message":"Nome do usuário deve ser fornecido"}'); //TODO: internacionalizar erros
	if (!user.groupId && !user.statusAdmin && !user.ivr)
		return res.status(400).end('{"message":"Grupo do usuário deve ser fornecido"}'); //TODO: internacionalizar erros
	if (!user.email)
		return res.status(400).end('{"message":"Email do usuário deve ser fornecido"}'); //TODO: internacionalizar erros
	if (!user.password)
		return res.status(400).end('{"message":"Senha do usuário deve ser fornecido"}'); //TODO: internacionalizar erros
	if (!user.confirmPassword)
		return res.status(400).end('{"message":"Senha do usuário deve ser confirmada"}'); //TODO: internacionalizar erros
	if (user.password != user.confirmPassword)
		return res.status(400).end('{"message":"Senhas não conferem"}'); //TODO: internacionalizar erros

	userDAO.selectUserByEmail(user.email, function(err, hasUser){
		if (err)
			return error.responseReturnXHR(res, err);
		
		if (hasUser)
			return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"Já existe um usuário com o email fornecido"}}); //TODO: internacionalizar erros
		
		userDAO.insert(user, function (err){
			error.responseReturnXHR(res, err);
		});
	});
};


//<--------------------------------- UPDATE ------------------------------------>
api.updateUser = function (req, res) {
	var user = req.body;
	user.id = req.params['id'];

	if (!user.name)
		return res.status(400).end('{"message":"Nome do usuário deve ser fornecido"}'); //TODO: internacionalizar erros
	if (!user.groupId && !user.statusAdmin && !user.ivr)
		return res.status(400).end('{"message":"Grupo do usuário deve ser fornecido"}'); //TODO: internacionalizar erros
	if (!user.email)
		return res.status(400).end('{"message":"Email do usuário deve ser fornecido"}'); //TODO: internacionalizar erros
	if (user.password) {
		if (!user.confirmPassword)
			return res.status(400).end('{"message":"Senha do usuário deve ser confirmada"}'); //TODO: internacionalizar erros
		if (user.password != user.confirmPassword)
			return res.status(400).end('{"message":"Senhas não conferem"}'); //TODO: internacionalizar erros
	}

	userDAO.selectUserByEmail(user.email, function(err, userFound){
		if (err)
			return error.responseReturnXHR(res, err);

		if (userFound && userFound.id != user.id)
			return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"Já existe um usuário com o email fornecido"}}); //TODO: internacionalizar erros
		
		userDAO.update(user, function (err) {
			error.responseReturnXHR(res, err);
		});
	});
};



//<--------------------------------- DELETE ------------------------------------>


//DELETE CHANNEL
api.deleteUser = function (req, res) {
	var id = req.params['id'];
	if (!id)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"ID deve ser fornecido"}});

	userDAO.delete(id, function (err){
		error.responseReturnXHR(res, err);
	});
};







module.exports = api;