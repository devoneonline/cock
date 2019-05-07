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

api.select = function (groupId,callback) {
    
    var sqlMapSelect = {
         table: "permission p,permission_group pg",
        fields: ['p.code', 'pg.permissionId', 'pg.groupId'],
        where:"pg.groupId = "+groupId+" and pg.permissionId = p.Id"
    };
    

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
		if (err)
			return callback(err);
           
        callback(null, rows);
    });
         
};

api.selectCountByCode = function (permissiongroup, callback) {
    var sqlMapSelect = {
        "table": "permission_group",
        "where": [
            {"groupId": permissiongroup.groupId,
             "permissionId": permissiongroup.permissionId
        }
        ],
        "fields": "count(1) as qt"
    };
    if (permissiongroup.groupId)
        sqlMapSelect.where.push(" groupId <> " + permissiongroup.groupId + " ");

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
        if (err)
            return callback(err);
        callback(null, rows[0].qt);
    });
}

api.update = function(permissiongroup, callback) {
    var sqlMapUpdate = {
        'table':'permission_group',
        'fields':{
            'permissionId':permissiongroup.permissionId,
        },
        'where': {
            'groupId':permissiongroup.groupId,
            'permissionId':permissiongroup.permissionIdWhere
        },
        'type':'update'
    };

    sqlUtil.executeQuery(sqlMapUpdate, function(err, rows) {
		if (err)
			return callback(err);
        callback();
    });
        
};

module.exports = api;