/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var sqlUtil = require('../sql-util');

api = {};

api.selectSessionByFilter = function(filter, callback) {
    var sqlMapSelect = {
        "table":"session",
        "fields":[
            "session.sessionCode", 
            "session.createDate", 
            "session.businessKey",
            "user_interaction.text", 
            "user_interaction.answerId", 
            "answer.title", 
            "answer.code",
            "answer_status.name as status",
            "session.operatingSystem", 
            "session.browser",
            "user_interaction.userSent",
            "channel.name as channelName",
            "project.name as projectName"
        ],
        "join":[
            {
                "sourceTable":"user_interaction",
                "sourceColumn":"sessionCode",
                "targetTable":"session",
                "targetColumn":"sessionCode",
                "type":"inner"
            },
            {
                "sourceTable":"channel",
                "sourceColumn":"id",
                "targetTable":"session",
                "targetColumn":"channelId",
                "type":"inner"
            },
            {
                "sourceTable":"project",
                "sourceColumn":"id",
                "targetTable":"session",
                "targetColumn":"projectId",
                "type":"inner"
            },
            {
                "sourceTable":"answer",
                "sourceColumn":"id",
                "targetTable":"user_interaction",
                "targetColumn":"answerId",
                "type":"left"
            },
            {
                "sourceTable":"answer_status",
                "sourceColumn":"id",
                "targetTable":"answer",
                "targetColumn":"statusId",
                "type":"left" 
            }
        ],
        "where": [
            {"session.projectId": filter.projectId}
        ],
        "orderBy":{
            "session.createDate":"desc",
            "user_interaction.id":"asc",
            "user_interaction.createDate":"asc"
        }
    };

    if (!filter.export) {
        sqlMapSelect.limit = {
            "first": filter.firstResult,
            "max": filter.maxResults
        }
    }

    if(!filter.sessionCode){
        if(filter.channelId)
            sqlMapSelect.where.push({'session.channelId': filter.channelId});

        if(filter.createDateIni)
            sqlMapSelect.where.push({'session.createDate >= ': filter.createDateIni});
        
        if(filter.createDateEnd)
            sqlMapSelect.where.push({'session.createDate <= ': filter.createDateEnd});

        if(filter.status){
            sqlMapSelect.where.push('session.sessionCode in (select distinct sessionCode from user_interaction where statusId in (' + filter.status + '))');
        }
    }else{
        sqlMapSelect.where.push({'session.sessionCode': filter.sessionCode});
    }

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows){
        callback(err, rows);
    }, true);
};

api.selectSessionCount = function(filter, callback) {
    var sqlMapSelect = {
        "table":"session",
        "fields":"count(1) as qtd",
        "join":[
            {
                "sourceTable":"user_interaction",
                "sourceColumn":"sessionCode",
                "targetTable":"session",
                "targetColumn":"sessionCode",
                "type":"inner"
            },
            {
                "sourceTable":"channel",
                "sourceColumn":"id",
                "targetTable":"session",
                "targetColumn":"channelId",
                "type":"inner"
            },
            {
                "sourceTable":"project",
                "sourceColumn":"id",
                "targetTable":"session",
                "targetColumn":"projectId",
                "type":"inner"
            },
            {
                "sourceTable":"answer",
                "sourceColumn":"id",
                "targetTable":"user_interaction",
                "targetColumn":"answerId",
                "type":"left"
            },
            {
                "sourceTable":"answer_status",
                "sourceColumn":"id",
                "targetTable":"answer",
                "targetColumn":"statusId",
                "type":"left" 
            }
        ],
        "where": [
            {"session.projectId": filter.projectId}
        ]
    };

    if(!filter.sessionCode){
        if(filter.channelId)
            sqlMapSelect.where.push({'session.channelId': filter.channelId});

        if(filter.createDateIni)
            sqlMapSelect.where.push({'session.createDate >= ': filter.createDateIni});
        
        if(filter.createDateEnd)
            sqlMapSelect.where.push({'session.createDate <= ': filter.createDateEnd});

        if(filter.status){
            sqlMapSelect.where.push('session.sessionCode in (select distinct sessionCode from user_interaction where statusId in (' + filter.status + '))');
        }
    }else{
        sqlMapSelect.where.push({'session.sessionCode': filter.sessionCode});
    }

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows){
        if(err)
            return callback(err);
        callback(null, rows[0].qtd);
    }, true);
}

module.exports = api;
