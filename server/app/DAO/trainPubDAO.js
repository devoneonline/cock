/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
'use strict'

const sqlUtil = require('../sql-util');

let tableTraining = 'training';
let tableIntent = 'intent';

let api = {};

//////////////     SELECT     //////////////

api.selectOnTraining = nlpId => {
    return new Promise((resolve, reject) => {
        let sqlMapSelect = {
            'table': tableTraining,
            'fields': [
                'uuid',
                'status',
                'version'
            ],
            'where': [
                `nlpEngineId = ${nlpId}`,
                `status = "processing"`
            ]
        };
        sqlUtil.executeQuery(sqlMapSelect, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })

}


api.loadTrainings = (nlpId, page, isEnable) => {
    var max = 7;
    var first = (page-1)*max;

    return new Promise((resolve, reject) => {
        if(isEnable == 'false') {
            var sqlMapSelect = {
                'table': tableTraining,
                'fields': [
                    'id',
                    // 'system_entityId',
                    'accuracy',
                    'version',
                    'createdBy',
                    'status',
                    'published',
                    'progress',
                    'createDate',
                    'removed',
                    'uuid'

                ],
                'where': [`nlpEngineId = ${nlpId}`,
                `status <> "processing"`],
                'orderBy':{'id':"desc"},
                'limit':{
                    'first':first,
                    'max':max
                }
            };
        } else {
            var sqlMapSelect = {
                'table': tableTraining,
                'fields': [
                    'id',
                    // 'system_entityId',
                    'accuracy',
                    'version',
                    'createdBy',
                    'published',
                    'status',
                    'progress',
                    'createDate',
                    'removed'
                ],
                'where': [`nlpEngineId = ${nlpId}`, 'status = "success"'],
                'orderBy':{'id':"desc"},
                'limit':{
                    'first':first,
                    'max':max
                }
            };
        }

        sqlUtil.executeQuery(sqlMapSelect, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })

}

api.getLastTraining = nlpId => {
    return new Promise((resolve, reject) => {
        let sqlMapSelect = {
            'table': tableTraining,
            'where': `nlpEngineId = ${nlpId}`,
            'limit': 1,
            'orderBy': {'id':"desc"}
        }

        sqlUtil.executeQuery(sqlMapSelect, (err, result) => {
            if (err) reject (err);
            resolve(result);
        })
    })
}

api.countTrainings = (nlpId, isEnable) => {
    return new Promise((resolve, reject) => {
        if (isEnable == 'false') {
            var sqlMapSelect = {
                'table': tableTraining,
                'where': `nlpEngineId = ${nlpId}`,
                "fields": "count(1) as qt"
            }
        } else {
            var sqlMapSelect = {
                'table': tableTraining,
                'where': [`nlpEngineId = ${nlpId}`, 'status = "success"'],
                "fields": "count(1) as qt"
            }
        }

        sqlUtil.executeQuery(sqlMapSelect, (err, result) => {
            if (err) reject(err);
                resolve(result[0].qt);
            });
    })
}

api.loadValidTrainings = nlpId => {

    return new Promise((resolve, reject) => {

        let sqlMapSelect = {
            'table': tableTraining,
            'fields': [
                'id',
                // 'system_entityId',
                'accuracy',
                'version',
                'createdBy',
                'published',
                'status',
                'progress',
                'createDate',
                'removed'
            ],
            'where': [
                `nlpEngineId = ${nlpId}`,
                `removed<>1`
            ],
            'orderBy':{'id':"desc"}
        };

        sqlUtil.executeQuery(sqlMapSelect, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })

}

api.selectNewIntents = nlpId => {
    return new Promise((resolve, reject) => {
        let sqlMapSelect = {
            "sql": "select count(1) as qt from intent i, intent_example ie where (i.nlpEngineId = ? and i.modified = '1' or ie.nlpEngineId = ? and ie.modified = '1') and i.id = ie.intentId;",
            "params":[nlpId, nlpId]
        };
        sqlUtil.executeQuery(sqlMapSelect, (err, result) => {
            if (err) reject(err);
            resolve(result[0].qt);
        });
    })
}

api.startTraining = nlpId => {
        return new Promise((resolve, reject) => {
        var sqlMapSelect = {
            'table': "intent, intent_example",
            'fields': ["intent.name, intent_example.text, intent.id"],
            'where': [
                `intent.nlpEngineId = ${nlpId}`,
                `intent.id = intent_example.intentId`,
                `intent.removed<>1`,
                `intent.enable=1`,
            ],
            'orderBy':{'intent.id':"desc"}
        };
        sqlUtil.executeQuery(sqlMapSelect, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}

api.insertTraining = (nlpId, version, uuid) =>  {
    return new Promise((resolve, reject) => {
        var sqlMapInsert = {
            'table': "training",
            'fields':{
                // "system_entityId": 1,
                "uuid": uuid,
                "nlpEngineId": nlpId,
                "version": version,
                "status" : "processing",
                "removed": 0,
                "createDate": new Date () 
            },
            'type': 'insert'
        };
        sqlUtil.executeQuery(sqlMapInsert, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });

    });
}

api.resetModified = nlpId => {
    return new Promise((resolve, reject) => {
        var sqlUpdate = {
            "sql": "update intent i, intent_example ie set i.modified = 0, ie.modified = 0 where (i.nlpEngineId = ? and i.modified = 1) or (ie.nlpEngineId = ? and ie.modified = 1);",
            "params": [nlpId, nlpId]
        }

        sqlUtil.executeQuery(sqlUpdate, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}

api.getCleverInterval = () => {
    return new Promise((resolve, reject) => {
        var sqlMapSelect  = {
            "table": "configuration",
            "fields": "configValue",
            "where": {'configKey':'clever.default.interval'}
        }

        sqlUtil.executeQuery(sqlMapSelect, (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

api.insertPublishTraining = nlpId => {
    return new Promise ((resolve, reject) =>{
        var sqlMapInsert = {
            'table': "training",
            'fields':{
                // "system_entityId": 1,
                "published": 1,
            },
            'type': 'insert'
        }
        sqlUtil.executeQuery(sqlMapInsert, (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

api.selectPublishedTraining = nlpId => {
    return new Promise((resolve, reject) => {
        let sqlMapSelect = {
            'table': tableTraining,
            'fields': [
                 'status',
                 'version',

            ],
            'where': [
                `nlpEngineId = ${nlpId}`,
                `published = 'prod'`
            ]
        };
        sqlUtil.executeQuery(sqlMapSelect, (err, result) => {
            console.log("em treinamento", result);
            if (err) reject(err);
            resolve(result);
        });
    })

}

api.updatePublished = (nlpId, uuid, value) => {
    return new Promise((resolve, reject) => {
        if (value == 'prod') {
            var sqlUpdate = {
                'table': tableTraining,
                'fields': {
                    'published': value
                },
                'where': [
                    `nlpEngineId = ${nlpId}`,
                    `uuid = ${uuid}`
                ],
                "type": 'update'
            }
        } else {
            var sqlUpdate = {
                'table': tableTraining,
                'fields': {
                    'published': value
                },
                'where': [
                    `nlpEngineId = ${nlpId}`,
                    `uuid != '${uuid}'`,
                    "published = 'prod'"
                ],
                "type": 'update'
            }
        }
        sqlUtil.executeQuery(sqlUpdate, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}

api.finishTraining = (nlpId, uuid, status, accuracy, user) => {
    return new Promise((resolve, reject) => {
        let sqlUpdate = {
            "table": tableTraining,
            "fields": {
                "status" : status == 'received' ? 'processing' : status,
                "accuracy": accuracy ? Math.round(accuracy*100) : 0,
                "createdBy": user
            },
            "where":[
                `nlpEngineId = ${nlpId}`,
                {uuid:uuid}
            ],
            'type': 'update'
        }

        sqlUtil.executeQuery(sqlUpdate, (err, result) => {
            if(err) reject(err);
            resolve(result);
        })
    })
}


module.exports = api;