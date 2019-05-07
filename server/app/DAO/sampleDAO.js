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

//SELECT ALL SAMPLES IN DATABASE.
api.select = function (projectId, callback) {
	
    var sqlMapSelect = {
        "table": "sample s, channel c",
        "fields": ['s.id','s.createDate','s.channelId','s.sampleBulk','s.sampleAssertivenessPercentage','s.observation','c.id','c.name'],
        "where": [
            "s.channelId = c.id",
            {"c.projectId": projectId}
        ]
    };

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
		if (err)
			return callback(err);

        callback(null, rows);
    });
        	
};



//SELECT SAMPLE IN DATABASE BY DATE AND CHANNELID
api.selectSampleBydateAndChannelId = function (filter, callback) {

    var sqlMapSelect = {
    "table": "sample s, channel c",
    "fields": ['s.createDate','s.sampleBulk','s.sampleAssertivenessPercentage','s.observation','s.channelId','c.name'],
        "where": [
            "s.channelId = c.id"
        ],
        "orderBy": "s.createDate, s.channelId"
    };


    if(filter.projectId)
        sqlMapSelect.where.push({'c.projectId':filter.projectId})

    if(filter.channelId)
        sqlMapSelect.where.push({'s.channelId':filter.channelId});
    
   if(filter.startDate)
        sqlMapSelect.where.push({'s.createDate >= ': filter.startDate});
    
    if(filter.endDate)
        sqlMapSelect.where.push({'s.createDate <= ': filter.endDate});


    if (!filter.export) {
        sqlMapSelect.limit = {
            "first": filter.firstResult,
            "max": filter.maxResults
        }
    }


    sqlUtil.executeQuery(sqlMapSelect, function(err, rows){
        callback(err, rows);
    });
        	
};


//SELECT COUNT DATE/IDCHANNEL IN DATABASE
api.selectCountByDateAndChannelId = function(filter, callback) {
    
    var sqlMapSelect = {
        "table": "sample s, channel c",
        "where": [
            "s.channelId = c.id"
        ],
        "fields": "count(1) as qt, sum(s.sampleBulk) as sumSamples, avg(s.sampleAssertivenessPercentage) as avgAssertiveness", 
    };
    

    if(filter.projectId)
        sqlMapSelect.where.push({'c.projectId':filter.projectId})

    if(filter.channelId)
        sqlMapSelect.where.push({'s.channelId':filter.channelId});
    
   if(filter.startDate)
        sqlMapSelect.where.push({'s.createDate >= ': filter.startDate});
    
    if(filter.endDate)
        sqlMapSelect.where.push({'s.createDate <= ': filter.endDate});


    sqlUtil.executeQuery(sqlMapSelect, function(err, rows){
        if(err)
            return callback(err);

        callback(null, rows[0]);
    });
}



//<------------------------------- INSERT ----------------------------------->
//VALIDADE IF EXISTS SAMPLE IN DATABASE AND INSERT BY PARM sqlMapInsert
api.insert = function (sample, callback) {
    var sqlMapInsert = {
        "table": "sample",
        "fields":{
            "createDate": sample.createDate,
            "channelId": sample.channelId,
            "sampleBulk": sample.sampleBulk,
            "sampleAssertivenessPercentage": sample.sampleAssertivenessPercentage,
            "observation": sample.observation
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
api.update = function(sample, callback) {
    var sqlMapUpdate = {
        'table':'sample',
        'fields':{
            'sampleBulk':sample.sampleBulk,
            "sampleAssertivenessPercentage": sample.sampleAssertivenessPercentage,
            "observation": sample.observation
        },
        'where': {
            'createDate':sample.createDate,
            'channelId':sample.channelId
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


