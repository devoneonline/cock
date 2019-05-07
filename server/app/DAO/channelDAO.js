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
//SELECT ALL CHANNEL IN DATABASE.
api.select = function (projectId, callback) {
	
    var sqlMapSelect = {
        "table": "channel c, channel_classification cl",
        "fields": ['c.id','c.name', 'c.systemName','c.projectId','c.classificationId','c.description','cl.name as classificationName'],
        "where": [
            "c.classificationId = cl.id",
            {"c.projectId": projectId}
        ],
        "orderBy": {
            "c.id":"asc"
        }
    };

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
		if (err)
			return callback(err);

        callback(null, rows);
    });
        	
};



//SELECT CHANNEL IN DATABASE BY ID
api.selectChannelById = function (projectId, id, callback) {
    var sqlMapSelect = {
        "table": "channel",
        "where": {
            "id" : id,
            "projectId": projectId
        }
    };

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
		if (err)
			return callback(err);
        
        callback(null, rows.length > 0 ? rows[0] : null);
    });
        	
};


//SELECT COUNT NAME IN DATABASE
api.selectCountByName = function (name, pId, id, callback) {
    var sqlMapSelect = {
        "table": "channel",
        "where": [
            {
                "name": name,
                "projectId": pId
            }
        ],
        "fields": "count(1) as qt"
    };
    if (id) {
        sqlMapSelect.where.push(" id <> " + id + " ");
    }

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
        if (err)
            return callback(err);
        callback(null, rows[0].qt);
    });
}

//SELECT COUNT SYSTEM NAME IN DATABASE
api.selectCountBySystemName = function (systemName, pId, id, callback) {
    var sqlMapSelect = {
        "table": "channel",
        "where": [
            {
                "systemName": systemName,
                "projectId": pId
            }
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



//<------------------------------- INSERT ----------------------------------->
//VALIDADE IF EXISTS CHANNEL IN DATABASE AND INSERT BY PARM sqlMapInsert
api.insert = function (channel, userName, systemName, callback) {
    var sqlMapInsert = {
        "table": "channel",
        "fields":{
            "name": channel.name,
            "systemName": systemName,
            "projectId": channel.projectId,
            "classificationId": channel.classificationId,
            "description": channel.description,
            "createdBy": userName,
            "createDate": new Date()
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
//UPDATE CHANNEL BY PARM sqlMapUpdate
api.update = function(channel, userName, systemName, callback) {
    var sqlMapUpdate = {
        'table':'channel',
        'fields':{
            'systemName':systemName,
            'name':channel.name,
            "classificationId": channel.classificationId,
            "description": channel.description,
            "updatedBy": userName,
            "updateDate": new Date()
        },
        'where': {
            'id':channel.id,
            'projectId':channel.projectId
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


//DELETE CHANNEL BY PARM sqlMapDelete
api.delete = function (projectId, id, callback) {
	
    var sqlMapDelete = {
        table: "channel",
        where: {
            'id':id,
            'projectId':projectId
        },
        type:"delete"
    };
    
    sqlUtil.executeQuery(sqlMapDelete, function(err) {
       
		if (err)
			return callback(err);

        callback();
        
    });
        	
};




module.exports = api;

