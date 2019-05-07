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
        "table":"configuration",
        "order":"configKey"
    }
    sqlUtil.executeQuery(sqlMap, function(err, rows) {
        if (err)
            return callback(err);
        callback(null, rows);
    });
}

api.insert = function(configuration, callback) {
    var sqlMap = {
        "table": "configuration",
        "fields": {
            "configKey": configuration.configKey,
            "configValue": configuration.configValue,
            "description": configuration.description
        },
        "type": "insert"
    }
    sqlUtil.executeQuery(sqlMap, function(err) {
        return callback(err);
    });
}

api.update = function(oldKey, configuration, callback) {
    var sqlMapUpdate = {
        'table':'configuration',
        'fields':{
            "configKey": configuration.configKey,
            "configValue": configuration.configValue,
            "description": configuration.description
        },
        'where': {
            "configKey": oldKey
        },
        'type':'update'
    };

    sqlUtil.executeQuery(sqlMapUpdate, function(err, rows) {
		if (err)
			return callback(err);
        callback();
    });
}

api.delete = function(key, callback) {
    var sqlMapDelete = {
        table: "configuration",
        where: {
            'configKey':key
        },
        type:"delete"
    };
    sqlUtil.executeQuery(sqlMapDelete, callback);
}

api.selectConfigurationByConfigKey = function(configKey, callback) {
    var sqlMap = {
        table:'configuration',
        where:[{
            'configKey':configKey
        }]
    };
    
    sqlUtil.executeQuery(sqlMap, function (err, rows) {
        if (err)
            return callback(err);
        callback(null, rows && rows.length > 0 ? rows[0] : null);
    });
};

module.exports = api;
