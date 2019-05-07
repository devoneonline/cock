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


//SELECT PROJECT_USER IN DATABASE
api.select = function (callback) {
    
    var sqlMapSelect = {};
    sqlMapSelect.table ="project_user"; 
    
    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
        if (err)
            return callback(err);

        callback(null, rows);
    });
            
};



//SELECT PROJECT_USER IN DATABASE BY ID
api.selectProjectUserByProjectId = function (id, callback) {
    var sqlMapSelect = {
        "table": "project_user",
        "where": {
            "projectId" : id
        }
    };

    

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
        if (err)
            return callback(err);
        
        callback(null, rows.length > 0 ? rows : null);
    });
            
};


/*
//SELECT PROJECT_USER IN DATABASE BY USERID
api.selectProjectUserByUserId = function (id, callback) {
    var sqlMapSelect = {
        "table": "project_user",
        "where": {
            "userId" : id
        }
    };

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
        if (err)
            return callback(err);
        
        callback(null, rows.length > 0 ? rows[0] : null);
    });
            
};*/



//<--------------------------------- INSERT ------------------------------------>


//VALIDADE IF EXISTS CHANNEL IN DATABASE AND INSERT BY PARM sqlMapInsert
api.insert = function (group, callback) {
    var sqlMapInsert = {
        "table": "project_user",
        "fields":{
            "projectId": group.projectId,
            "userId": group.userId
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
        'table':'project_user',
        'fields':{
            "projectId": group.projectId,
            "userId": group.userId
        },
        'where': {
            'projectId':group.projectIdKey,
            "userId": group.userIdKey
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
api.delete = function (group, callback) {
    
    var sqlMapDelete = {
        table: "project_user",
        where: {
            "projectId": group.projectIdKey,
            "userId": group.userIdKey
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