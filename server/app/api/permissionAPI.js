/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var permissionDAO = require('../DAO/permissionDAO');
var error = require('../error/error');

var api = {};

//<-----------------------------SELECT------------------------------->
//SELECT ALL PERMISSIONS
api.selectAllPermissions = function (req, res) {
	permissionDAO.select(function (err, permissions) {
		error.responseReturnXHR(res, err, permissions);
	});
};

//SELECT THE PERMISSION BY ID
api.selectPermissionById = function (req, res) {
	var id = req.params['id'];

	if (!id)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"ID deve ser fornecido"}});

	permissionDAO.selectPermissionById(id, function (err,permission){
		if (!err && !permission)
			err = {
				"status": 204
			};
		error.responseReturnXHR(res, err, permission);
	});
};


module.exports = api;