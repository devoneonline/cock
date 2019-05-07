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

//SELECT PROJECTS IN DATABASE BY USER PARM sqlMapSelect
api.selectProjectsByUser = function(userId, callback) {
    var sqlMap = {
        "table": "project_user pu, project p, nlp_engine n",
        "fields": ["p.id, p.name, p.locale, p.nlpEngineId, n.nlp"],
        "where": [
            {"pu.userId":userId},
            "pu.projectId = p.id",
            "n.id = p.nlpEngineId"
        ]
    };
    sqlUtil.executeQuery(sqlMap, function(err, rows) {
        callback(err, rows);
    });
};

//SELECT ALL PROJECT
api.select = function (callback) {//
    var sqlMapSelect = {
        "table": "project p",
        "fields":[
            "p.id",
            "p.name",
            "p.locale",
            "p.nlpEngineId",
            "p.description",
            "nlp_engine.nlp",
            "nlp_engine.metadata",
            "chatbase.api_key"
        ],
        "join": [{
            "sourceTable":"nlp_engine",
            "sourceColumn":"id",
            "targetTable": "p",
            "targetColumn": "nlpEngineId",
            "type": "inner"
        },{
            "sourceTable": "chatbase",
            "sourceColumn": "projectId",
            "targetTable": "p",
            "targetColumn": "id",
            "type": "left"
        }],
        "where": "p.removed <> 1"
    };

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
		if (err) {
            return callback(err);
        }
        callback(null, rows);
    });
        	
};

//SELECT ALL PROJECT
api.selectSimplified = function (callback) {
    var sqlMapSelect = {"fields":[
        "id","name" 
    ]};
    sqlMapSelect.table ="project"; 

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
		if (err)
			return callback(err);

        callback(null, rows);
    });
        	
};

api.selectByUser = function(userId, callback) {
    var sqlMap = {
        "table": "project_user pu, project p",
        "fields":["p.id, p.name, p.workspaceUrl, p.workspaceUsername, p.workspacePassword, p.description, p.contentType, p.locale"],
        "where":[
            {"pu.userId":userId},
            "pu.projectId = p.id"
        ]
    };

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
		if (err)
			return callback(err);

        callback(null, rows);
    });
};

api.selectIdByName = (name, callback) => {
    let sqlMapSelect = {
        "table": "project",
        "fields": "id",
        "where": {
            "name": name
        }
    };

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
        if (err)
            return callback(err);
        
        callback(null, rows && rows.length ? rows[0].id : null);
    });
}

api.selectImageById = function(id, callback) {
    var sqlMapSelect = {
        "table": "project",
        "fields": ["image", "contentType"],
        "where": {
            "id" : id
        }
    };

    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
		if (err)
			return callback(err);

        callback(null, rows && rows.length ? rows[0] : null);
    });
};

//SELECT PROJECT IN DATABASE BY ID
api.selectProjectById = function (id, callback) {
    var sqlMapSelect = {
        "table": "project",
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


api.selectCountByName = function (name, id, callback) {
    var sqlMapSelect = {
        "table": "project",
        "where": [
            {"name": name},
            "removed = 0"
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

api.selectChatbase = (id, callback) => {
    let sqlMapSelect = {
        "table": "chatbase",
        "fields": "projectId",
        "where": {
            "projectId": id
        }
    }
    sqlUtil.executeQuery(sqlMapSelect, (err, rows) => {
        console.log(rows);
        if (err) return callback(err);
        callback(null, rows.length > 0 ? rows[0] : null);
    })
}


//<------------------------------- INSERT ----------------------------------->
//VALIDADE IF EXISTS CHANNEL IN DATABASE AND INSERT BY PARM sqlMapInsert

api.insert = (project, userName, nlpInsertContent, callback) => {
    
    var planMap = {
        "errorCallback": callback,
        "plan": [
            {
                "sqlMap": {
                    "table": "nlp_engine",
                    "fields": {
                        "name": project.nlpName,
                        "nlp": project.nlp,
                        "metadata": nlpInsertContent,
                        "createDate": new Date(),
                        "updateDate": null,
                        "removed": 0
                    },
                    "type": "insert"
                }
            },
            {
                "sqlMap":"select LAST_INSERT_ID() as id;",
                "after":function(rows) {
                    return rows[0].id;
                }
            },
            {
                "sqlMap": {
                    "table": "project",
                    "fields":{
                        "name": project.name,
                        "locale": project.locale,
                        "description":project.description,
                        "image": project.image,
                        "contentType": project.contentType,
                        "createdBy": userName,
                        "createDate": new Date(),
                        "updatedBy": null,
                        "updateDate": null
                    },
                    "type":"insert"
                },
                "before":function(id, step) {
                    step.sqlMap.fields["nlpEngineId"] = id;
                },
                "after": function() {
                    callback();
                }
            }
        ]
    };

    if (project.api_key) {
        planMap.plan[planMap.plan.length - 1].after = null;
        planMap.plan.push({
            "sqlMap":"select LAST_INSERT_ID() as id;",
            "after":function(rows) {
                return rows[0].id;
            }
        });
        planMap.plan.push({
            "sqlMap": {
                "table": "chatbase",
                "fields":{
                    "name": project.name,
                    "api_key": project.api_key
                },
                "type":"insert"
            },
            "before":function(id, step) {
                step.sqlMap.fields["projectId"] = id;
            },
            "after": function() {
                callback();
            }
        });
    }

    sqlUtil.executionPlan(planMap, function(err) {
        return callback(err);
    });
}

api.insertChatbase = (name, api_key, id, callback) => {
    let sqlMapInsert = {
        "table": "chatbase",
        "fields": {
            "name": name,
            "api_key": api_key,
            "projectId": id
        },
        "type": "insert"
    }

    sqlUtil.executeQuery(sqlMapInsert, (err) => {
        if (err) { return callback(err); }
        callback();
    });
}

//<--------------------------------- UPDATE ------------------------------------>

api.update = function(project, nlpMetadata, userName, callback) {
    let sqlMapUpdate = {};
    if(project.api_key) {
        sqlMapUpdate = {
            'table':'project p, nlp_engine n, chatbase c',
            "fields":{
                "p.name": project.name,
                "p.locale": project.locale,
                "p.nlpEngineId": project.nlpEngineId,
                "p.description":project.description,
                "p.image": project.image,
                "p.contentType": project.contentType,
                "p.updatedBy": userName,
                "p.updateDate": new Date(),
                "n.name ": project.nlpName,
                "n.nlp":project.nlp,
                "n.metadata": nlpMetadata,
                "c.api_key": project.api_key
                // ,
                // "p.removed": project['removed']
              },
            'where': {
                'p.id':project.id,
                'n.id': project.nlpEngineId,
                'c.projectId': project.id
    
            },
            'type':'update'
        };
    } else {
        sqlMapUpdate = {
            'table':'project p, nlp_engine n',
            "fields":{
                "p.name": project.name,
                "p.locale": project.locale,
                "p.nlpEngineId": project.nlpEngineId,
                "p.description":project.description,
                "p.image": project.image,
                "p.contentType": project.contentType,
                "p.updatedBy": userName,
                "p.updateDate": new Date(),
                "n.name ": project.nlpName,
                "n.nlp":project.nlp,
                "n.metadata": nlpMetadata
              },
            'where': {
                'p.id':project.id,
                'n.id': project.nlpEngineId
    
            },
            'type':'update'
        };
    }

    if (project.image) {
        sqlMapUpdate.fields['image'] = project.image;
        sqlMapUpdate.fields['contentType'] = project.contentType;
    }

    sqlUtil.executeQuery(sqlMapUpdate, function(err, rows) {
        console.log("err" + err)
        if (err)
			return callback(err);
        callback();
    });
        
};


api.updateToRemove = (id, callback) => {
    let sqlMapUpdate = {
        'table':'project',
        "fields":{
            "removed": 1
            },
        'where': {
            "id": id

        },
        'type':'update'
    }

    sqlUtil.executeQuery(sqlMapUpdate, function(err, rows) {
		if (err)
			return callback(err);
        callback();
    });
}





//<--------------------------------- DELETE ------------------------------------>



//DELETE CHANNEL BY PARM sqlMapDelete
api.delete = function (id, callback) {
	
    var sqlMapDelete = {
        table: "project",
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

