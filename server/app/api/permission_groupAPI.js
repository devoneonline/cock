/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var permissionGroupDAO = require('../DAO/permission_groupDAO');
var error = require('../error/error');

var api = {};

//SELECT THE PERMISSIONGROUP BY GROUPID
api.selectPermissionGroupByGroupId =  function (req,res){

	var groupid = req.params['id'];

	if (!groupid)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"GROUPID deve ser fornecido"}});

	permissionGroupDAO.select(groupid, function (err,permissiongroup){
		if (!err && !permissiongroup)
			err = {
				"status": 204
			};
		error.responseReturnXHR(res, err, permissiongroup);
	});
};

// UPDATE THE PERMISSIONGROUP BY GROUPID AND PERMISSIONID
api.updatePermissionGroup = function (req, res) {
	var permissiongroup = req.body;

	if (!permissiongroup.groupId)
		return res.status(400).end('{"message":"Código do grupo deve ser fornecido"}'); //TODO: internacionalizar erros
	if (!permissiongroup.permissionId)
		return res.status(400).end('{"message":"Código da permissão deve ser fornecido"}'); //TODO: internacionalizar erros
	

	permissionGroupDAO.selectCountByCode(permissiongroup, function(err, count){
		if (err)
			return error.responseReturnXHR(res, err);

		if (count > 0)
			return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"Já existe um canal com o nome fornecido"}}); //TODO: internacionalizar erros
		
		permissionGroupDAO.update(permissiongroup, function (err) {
			error.responseReturnXHR(res, err);
		});
	});
};

module.exports = api;