/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var sqlUtil = require('../sql-util');

var api = {}

//<--------------------------------- SELECT ------------------------------------>
//SELECT PERMISSION IN DATABASE BY PARM sqlMapSelect
api.select = function (callback) {
	
    var sqlMapSelect = {};
    sqlMapSelect.table ="permission"; 

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
		if (err)
			return callback(err);

        callback(null, rows);
    });
        	
};
         
api.selectPermissionById = function (id, callback) {
    var sqlMapSelect = {
        "table": "permission",
        "where": {
            "id" : id
        }
    };

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
		if (err)
			return callback(err);
        
        callback(null, rows.length > 0 ? rows[0] : null);
    });
        	
};

api.selectPermissionByCode = function (code, callback) {
    var sqlMapSelect = {
        "table": "permission",
        "where": {
            "code" : code
        }
    };

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
		if (err)
			return callback(err);
        
        callback(null, rows.length > 0 ? rows[0] : null);
    });
        	
};







module.exports = api;