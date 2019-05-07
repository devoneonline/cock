/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/

//var user_interactionAPI = require('../api/user_interactionAPI');
var sqlUtil = require('../sql-util');
var error = require('../error/error');

module.exports = function(app) {
    
    app.get('/cockpit/ivr/call/:phoneNumber', function(req, res) {
    	var phoneNumber = req.params['phoneNumber'];
    	var sqlMap = {
    		"sql":"select distinct(code) from answer where id in " +
    				"(select answerId from user_interaction where sessionCode = " +
    					"(select sessionCode from session where businessKey = ? order by createDate desc limit 1) " +
    				"order by createDate desc)",
    		"params":[phoneNumber]
    	};
    	
    	sqlUtil.executeSQL(sqlMap.sql, sqlMap.params, function(err, rows){
    		var codes = [];
    		for (i in rows)
				codes[codes.length] = rows[i].code;
            error.responseReturnXHR(res, err, codes);
        });
    });
    
    app.get('/cockpit/ivr/phones', function(req, res) {
    	var sqlMap = {
    		"sql":"select phoneNumber from active_call where active = 1;",
    		"params":[]
    	};
    	
    	sqlUtil.executeSQL(sqlMap.sql, sqlMap.params, function(err, rows){
    		var codes = [];
    		for (i in rows)
				codes[codes.length] = rows[i].phoneNumber;
            error.responseReturnXHR(res, err, codes);
        });
    });

}
