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


//SELECT ALL GROUP IN DATABASE 
api.select = function (callback) {
	
    var sqlMapSelect = {};
    sqlMapSelect.table ="group_user"; 
    
    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
		if (err)
			return callback(err);

        callback(null, rows);
    });
        	
};




//SELECT CHANNEL IN DATABASE BY ID
api.selectGroupById = function (id, callback) {
    var sqlMapSelect = {
        "table": "group_user",
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



//SELECT COUNT NAME IN DATABASE
api.selectCountByName = function (name, id, callback) {
    var sqlMapSelect = {
        "table": "group_user",
        "where": [
            {"name": name}
        ],
        "fields": "count(1) as qt"
    };
    if (id)
        sqlMapSelect.where.push(" id <> " + id + " ");

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
        if (err)
            return callback(err);
        callback(null, rows[0].qt);
    });
}




//<--------------------------------- INSERT ------------------------------------>

//VALIDADE IF EXISTS CHANNEL IN DATABASE AND INSERT BY PARM sqlMapInsert
api.insert = function (group, callback) {
    var sqlMapInsert = {
        "table": "group_user",
        "fields":{
            "name": group.name
            },
        "type":"insert"
        };

    sqlUtil.executeQuery(sqlMapInsert, function(err) {
            if (err)
            return callback(err);
        callback();
    });
};







//<--------------------------------- UPDATE ------------------------------------>


//UPDATE GROUP USER BY PARM sqlMapUpdate (name)
api.update = function(group, callback) {
    var sqlMapUpdate = {
        'table':'group_user',
        'fields':{
            'name':group.name
        },
        'where': {
            'id':group.id
        },
        'type':'update'
    };


    sqlUtil.executeQuery(sqlMapUpdate, function(err, rows) {
		if (err)
			return callback(err);
        callback();
    });
        
};





//<--------------------------------- DELETE ------------------------------------>


//DELETE GROUP USER BY PARM sqlMapDelete
api.delete = function (id, callback) {
	
    var sqlMapDelete = {
        table: "group_user",
        where: {
            'id':id
        },
        type:"delete"
    };

    sqlUtil.executeQuery(sqlMapDelete, function(err) {
       
		if (err)
			return callback(err);

        callback(null);
        
    });
        	
};




module.exports = api;