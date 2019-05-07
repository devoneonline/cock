/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var sqlUtil = require('../sql-util');

var api = {};

api.select = function(callback) {
    var sqlMap = {
        "table":"answer_status",
        "orderBy":"name"
    }
    sqlUtil.executeQuery(sqlMap, function(err, rows) {
        if (err)
            return callback(err);
        callback(null, rows);
    });
}

api.insert = function(answerStatus, callback) {
    var sqlMap = {
        "table": "answer_status",
        "fields": {
            "name": answerStatus.name,
            "success" : answerStatus.success,
            "defaultStatus": answerStatus.defaultStatus
        },
        "type": "insert"
    }
    sqlUtil.executeQuery(sqlMap, function(err) {
        return callback(err);
    });
}

api.update = function(answerStatus, callback) {
    var sqlMapUpdate = {
        'table':'answer_status',
        'fields':{
            "name": answerStatus.name,
            "success" : answerStatus.success,
            "defaultStatus": answerStatus.defaultStatus
        },
        'where': {
            "id": answerStatus.id
        },
        'type':'update'
    };

    sqlUtil.executeQuery(sqlMapUpdate, function(err, rows) {
		if (err)
			return callback(err);
        callback();
    });
}

api.delete = function(id, callback) {
    var sqlMapDelete = {
        table: "answer_status",
        where: {
            'id':id
        },
        type:"delete"
    };
    sqlUtil.executeQuery(sqlMapDelete, callback);
}

api.selectAnswerStatusByName = function(name, id, callback) {
    var sqlMap = {
        table:'answer_status',
        where:[{
            'name':name
        }]
    };
    if (id)
        sqlMap.where.push('id <> ' + id);
    
    sqlUtil.executeQuery(sqlMap, function (err, rows) {
        if (err)
            return callback(err);
        callback(null, rows && rows.length > 0 ? rows[0] : null);
    });
};

api.selectDefaultStatus = function(id, callback) {
    if (typeof(id) == 'function') {
        callback = id;
        id = null;
    }
    var sqlMap = {
        table:'answer_status',
        where:[{
            'defaultStatus':1
        }]
    };
    
    sqlUtil.executeQuery(sqlMap, function (err, rows) {
        if (err)
            return callback(err);
        callback(null, rows && rows.length > 0 ? rows[0] : null);
    });
};

api.removeDefault = function(id, callback) {
    if (typeof(id) == 'function') {
        callback = id;
        id = null;
    }
    var sqlMap = {
        table:'answer_status',
        fields:{
            'defaultStatus':0
        },
        type:'update'
    };
    if (id)sqlMap.where = {'id':id};

    sqlUtil.executeQuery(sqlMap, function (err) {
        if (err)
            return callback(err);
        callback(null);
    });
};

module.exports = api;
