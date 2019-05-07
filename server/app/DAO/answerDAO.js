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
var table = "answer";

api.selectFaqOfAnswer = function (projectId, title, callback) {
   var sqlMapSelect = {
        "table": table,
        "fields": ["distinct title"],
        "where": {
            "projectId" : projectId,
            "title LIKE": '%'+title+'%'
        },
        "group":"code"
    };
    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
        if (err)
			return callback(err);
        callback(null, rows);
    });	
};

api.selectCodeOfAnswer = function (projectId, code, callback) {
   var sqlMapSelect = {
        "table": table,
        "fields": ["distinct code"],
        "where": {
            "projectId" : projectId,
            "code LIKE": '%'+code+'%'
        }
    };
    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
        if (err)
			return callback(err);
        callback(null, rows);
    });	
};

api.escapeRegExp = function(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
api.searchAnswers = function(projectId, filter, callback) {
    var max = filter.max ? filter.max : 20;
    max = max > 100 ? 100 : max;
    var first = filter.page ? (filter.page-1) * max : 0;
    var sqlMap = {
        table: table,
        "fields": [
            "title",
            "code",
            "statusId",
            "activeGroup",
            "count(code) as qt_code_agg"
        ],
        where: {
            "projectId": projectId,
        },
        group:"code",
        limit: {
            "first": first,
            "max": max
        }
    };
    if (filter.title) {
        sqlMap.where["title LIKE"] = '%'+filter.title+'%';
    }
    if (filter.text) {
        var t = api.escapeRegExp(filter.text).replace(/  +/g, " ").replace(" ", "( *(<[^>]+>)* *)");
        sqlMap.where["text REGEXP"] = t;
    }
    if (filter.code) {
        sqlMap.where["code LIKE"] = filter.code;
    }
    if (filter.activeGroup) {
        sqlMap.where.activeGroup = 0;
    }
    
    sqlUtil.executeQuery(sqlMap, callback);
};

api.selectAnswerByDirectory = function (directoryId, projectId, locale, callback) {
    if (typeof(projectId) == 'function') {
        callback = projectId;
        projectId = null;
    } else if (typeof(locale) == 'function') {
        callback = locale;
        locale = null;
    }
    var sqlMapSelect = {
        "table": table,
        "fields": [
            "id",
            "title",
            "code",
            "statusId",
            "projectId",
            "activeGroup",
            "count(code) as qt_code_agg"],
        "where": {
            "directoryId" : directoryId
        },
        "group":"code",
        "orderBy":{
            "answer.activeGroup":"desc",
            "answer.code":"asc"
        }
    };
    if (projectId)
        sqlMapSelect.where.projectId = projectId;
    if (locale)
        sqlMapSelect.where.locale = locale;
    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
        if (err)
			return callback(err);
        callback(null, rows);
    });
};

api.selectAnswerByCode = function (code, projectId, locale, callback) {
   var sqlMapSelect = {
        "table": table,
        "where": {
            "code" : code,
            "projectId" : projectId,
            "locale" : locale,
        }
    };
    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
        if (err)
			return callback(err);

        var answers = rows;
        var ids = [];
        for (i in answers) {
            answers[i].options = [];
            ids.push(answers[i].id);
        }
        
        sqlMapSelect = {
            "sql":"select * from answer_option where answerId in (:IDS:) order by answerId, optionOrder",
            "params":ids
        };
        var qms = "";
        for(var i = 0; i < ids.length; i++) {
            qms += "?" + (i+1 < ids.length ? "," : "");
        }
        sqlMapSelect.sql = sqlMapSelect.sql.replace(':IDS:', qms);
        
        sqlUtil.executeSQL(sqlMapSelect.sql, sqlMapSelect.params, function(err, rows){
            if (err)
                return callback(err);
            
            for (i in rows) {
                var row = rows[i];
                for (j in answers)
                    if (answers[j].id == rows[i].answerId)
                        answers[j].options.push(row);
            }

            callback(null, answers);
        });
    });	
};

var removeOptionPlan = function(option, planMap) {
    planMap.plan.push({
        "sqlMap": {
            "table":"answer_option",
            "where": {
                "id": option.id
            },
            "type":"delete"
        },
        "before":function(id, step) {
            step.sqlMap.where["answerId"] = id;
        },
        "after":function(rows, step) {
            return step.sqlMap.where.answerId;
        }
    });
}

var insertOptionPlan = function(option, userName, planMap) {
    planMap.plan.push({
        "sqlMap":{
            "table": "answer_option",
            "fields": {
                "title": option.title,
                "text": option.text,
                "action" : option.action?true:false,
                "locale": option.locale,
                "optionOrder": option.optionOrder,
                "textTypeAction": option.textTypeAction,
                "createdBy": userName,
                "createDate": new Date(),
                "ivrOption": option.ivrOption
            },
            "type": "insert"
        },
        "before":function(id, step) {
            step.sqlMap.fields["answerId"] = id;
        },
        "after":function(rows, step) {
            return step.sqlMap.fields.answerId;
        }
    });
}

var updateOptionPlan = function(option, userName, planMap) {
    planMap.plan.push({
        "sqlMap":{
            "table": "answer_option",
            "fields": {
                "title": option.title,
                "text": option.text,
                "action" : option.action?true:false,
                "locale": option.locale,
                "optionOrder": option.optionOrder,
                "textTypeAction": option.textTypeAction,
                "updatedBy": userName,
                "updateDate": new Date(),
                "ivrOption": option.ivrOption
            },
            "where": {
                "id":option.id
            },
            "type": "update"
        },
        "before":function(id, step) {
            step.sqlMap.fields["answerId"] = id;
        },
        "after":function(rows, step) {
            return step.sqlMap.fields.answerId;
        }
    });
}

var optionsPlan = function(options, userName,  planMap) {
    for (i in options) {
        var option = options[i];
        if (option.removed && option.id) {
            removeOptionPlan(option, planMap);
        } else if (option.id) {
            updateOptionPlan(option, userName, planMap);
        } else {
            insertOptionPlan(option, userName, planMap);
        }
    }
}

var updateAnswerPlan = function(answer, userName, planMap) {
    planMap.plan.push({
        "sqlMap": {
            "table": table,
            "fields": {
                "code": answer.code,
                "title": answer.title,
                "transactional" : answer.transactional,
                "optionsMapping": answer.optionsMapping,
                "text": answer.text,
                "audioText": answer.audioText,
                "locale": answer.locale,
                "projectId": answer.projectId,
                "channelId": answer.channelId,
                "type": answer.type,
                "statusId": answer.statusId,
                "technicalText": answer.technicalText,
                "directoryId": answer.directoryId,
                "updatedBy": userName,
                "updateDate": new Date(),
                "active": answer.enabled,
                "textSimple": answer.textSimple,
                "likeable": (answer.likeable == true? '1':'0')
            },
            "where": {
                "id": answer.id
            },
            "type": "update",
        },
        "after": function(rows, step) {
            return step.sqlMap.where.id;
        }
    });
    optionsPlan(answer.options, userName, planMap);
}

var insertAnswerPlan = function(answer, userName, planMap) {
    planMap.plan.push({
        "sqlMap":{
            "table": table,
            "fields": {
                "code": answer.code,
                "title": answer.title,
                "transactional" : answer.transactional,
                "optionsMapping": answer.optionsMapping,
                "text": answer.text,
                "audioText": answer.audioText,
                "locale": answer.locale,
                "projectId": answer.projectId,
                "channelId": answer.channelId,
                "type": answer.type,
                "statusId": answer.statusId,
                "technicalText": answer.technicalText,
                "directoryId": answer.directoryId,
                "createdBy": userName,
                "createDate": new Date(),
                "active": answer.enabled,
                "textSimple": answer.textSimple,
                "likeable": (answer.likeable == true? '1':'0')
            },
            "type": "insert"
        }
    });
    planMap.plan.push({
        "sqlMap":"select last_insert_id() as id;",
        "after":function(rows) {
            return rows[0].id;
        }
    });
    optionsPlan(answer.options, userName, planMap);
}

var disableAnswerPlan = function(answer, userName, planMap) {
    for (i in answer.options) {
        var option = answer.options[i];
        planMap.plan.push({
            "sqlMap": {
                "table":"answer_option",
                "fields":{
                    "updatedBy": userName,
                    "updateDate": new Date(),
                    "active":answer.enabled
                },
                "where": {
                    "id": option.id
                },
                "type":"update"
            }
        });
    }
    planMap.plan.push({
        "sqlMap": {
            "table":table,
            "fields":{
                "updatedBy": userName,
                "updateDate": new Date(),
                "active":answer.enabled
            },
            "where": {
                "id": answer.id
            },
            "type":"update"
        }
    });
}

var createPlan = function(answer, userName, planMap) {
    if (!answer.transactional) { answer.transactional = false; }
    if (answer.id && answer.enabled) {
        updateAnswerPlan(answer, userName, planMap);
    } else if (answer.id) {
        disableAnswerPlan(answer, userName, planMap);
    } else {
        insertAnswerPlan(answer, userName, planMap);
    }
}

api.processAnswers = function(answers, userName,callback) {
    var planMap = {
        "errorCallback":callback,
        "plan":[]
    };
    
    for(let ans of answers) {
        console.log(ans);
        createPlan(ans, userName, planMap);
    }

    planMap.plan[planMap.plan.length-1].after = function() {
        callback();
    };
    
    sqlUtil.executionPlan(planMap, function(err) {
        return callback(err);
    });
}

api.delete = function(id, callback) {
    var sqlMapDelete = {
        table: table,
        where: {
            'id':id
        },
        type:"delete"
    };
    sqlUtil.executeQuery(sqlMapDelete, callback);
}

api.deleteAnswerByCode = function(code, projectId, locale, callback) {
    var planMap = {
        "errorCallback":callback,
        plan:[]
    };
    planMap.plan.push({
        "sqlMap":{
            "table":table,
            "fields":"id",
            "where":{
                "code":code,
                "projectId":projectId,
                "locale":locale
            }
        },
        "after":function(rows) {
            console.log("ids",rows);
            var ids = [];
            for (i in rows) {
                ids.push(rows[i].id);
            }
            return ids;
        }
    });
    planMap.plan.push({
        "sqlMap":{
            "sql":"delete from answer_option where answerId in (",
            "params":[]
        },
        "before":function(ids, step) {
            for (var i = 0; i < ids.length; i++) {
                step.sqlMap.sql += "?" + (i+1 < ids.length ? "," : "");
                step.sqlMap.params.push(ids[i]);
            }
            step.sqlMap.sql += ");";
            console.log("option", step.sqlMap.sql, step.sqlMap.params);
        },
        "after":function(rows,step, ids) {
            return ids;
        }
    });
    planMap.plan.push({
        "sqlMap":{
            "sql":"delete from answer where id in (",
            "params":[]
        },
        "before":function(ids, step) {
            for (var i = 0; i < ids.length; i++) {
                step.sqlMap.sql += "?" + (i+1 < ids.length ? "," : "");
                step.sqlMap.params.push(ids[i]);
            }
            step.sqlMap.sql += ");";
        },
        "after":function() {
            callback();
        }
    });
    sqlUtil.executionPlan(planMap);
}

api.selectDuplicateAnswer = function(answer, callback) {
    var sqlMap = {
        'table':'answer',
        'fields':'count(1) as qtd',
        'where': [
            {"locale": answer.locale},
            {"code": answer.code},
            {"projectId": answer.projectId},
            {"channelId": answer.channelId}
        ]
    };

    if (answer.id)
        sqlMap.where.push('id <> ' + answer.id);

    sqlUtil.executeQuery(sqlMap, function(err, rows) {
		if (err)
			return callback(err);
        callback(null, rows[0].qtd);
    });
}

api.updateActiveGroup = function(projectId, directoryId, code, activeGroup, callback) {

    var sqlMapUpdate = {
        "table": table,
        "fields":{"activeGroup": activeGroup},
        "where":[],
        "type": "update"
    };

    if (projectId) {
        sqlMapUpdate.where.push({"projectId": projectId});
    }

    if (directoryId) {
        if (directoryId.push) {
            var ids = '';
            for (i in directoryId) {
                ids += directoryId[i] + ",";
            }
            ids = ids.substring(0, ids.length-1);
            sqlMapUpdate.where.push("directoryId in (" + ids + ")");
        } else {
            sqlMapUpdate.where.push({"id": id});
        }
    }

    if (code) {
        if (code.push) {
            var codes = '';
            for (i in code) {
                codes += "'" + code[i] + "',";
            }
            codes = codes.substring(0, codes.length-1);
            sqlMapUpdate.where.push("code in (" + codes + ")");
        } else {
            sqlMapUpdate.where.push({"code": code});
        }
    }


    console.log('===== ===== ===== ===== =====');
    console.log(sqlMapUpdate);
    console.log('===== ===== ===== ===== =====');
    
    sqlUtil.executeQuery(sqlMapUpdate, function(err){
        callback(err);
    })
}

// EXPORT
api.exportAnswer = function(filter, callback){
    var sqlMapSelect = {
        "table":table,
        "fields":[
            //"answer.id",
            "answer.code",
            "answer.title",
            "answer.text",
            "channel.name",
            "case when answer.activeGroup = 0 then 'Inativo' else 'Ativo' end as status"
        ],
        "join":[
            {
                "sourceTable":"channel",
                "sourceColumn":"id",
                "targetTable":"answer",
                "targetColumn":"channelId",
                "type":"left"
            }
        ],
        "where":[
            {"answer.projectId":filter.projectId},
            {"answer.locale":filter.locale}
        ],
        "orderBy":{
            "answer.code":"asc"
        }
    };

    // if(filter.title)
    //     sqlMapSelect.where.push({"title LIKE": '%'+filter.title+'%'});

    // if(filter.text) {
    //     var t = api.escapeRegExp(filter.text).replace(/  +/g, " ").replace(" ", "( *(<[^>]+>)* *)");
    //     sqlMap.where.push({"text REGEXP":t});
    // }

    // if(filter.active)
    //     sql.sqlMapSelect.where.push({"active":filter.active});

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows){
        callback(err, rows);
    });
}

api.codesAndTitles = function(callback) {
	var sqlMap = {
		"table":table,
		"fields":["distinct(code), title"]
	};
	sqlUtil.executeQuery(sqlMap, function(err, rows){
        callback(err, rows);
    });
}

module.exports = api;
