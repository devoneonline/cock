/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
'use strict';

const sqlUtil = require('../sql-util');
let api = {};
let tableEntity = 'entity';
let tableSystemEntity = 'system_entity';
let tableSimple = 'entity_simple';
let tableSynonym = 'entity_synonym';

api.listEntities = (nlpId, page, callback) => {
    var max = 6;
    var first = (page-1)*max;
    let sqlMapSelect = {
        'table': tableEntity,
        'fields': [
            'id',
            'name',
            'description',
            'type',
            'pattern',
            'trainingId',
            'createDate',
            'updateDate'
        ],
        'where': [
            {'nlpEngineId':nlpId},
            'removed <> 1',
        ],
        'orderBy':{'id':"desc"},
        'limit':{
          'first':first,
          'max':max
        }
    };
    sqlUtil.executeQuery(sqlMapSelect, (err, entities)=> {
        if (err) { return callback(err); }
        callback(null, entities);
    });
}

api.listSystemEntities = (callback) => {
    let sqlMapSelect =  {
        'table': tableSystemEntity,
        'fields': [
          'id',
          'trainingId',
          'name',
          'description',
          'jsonMetadata',
          'createDate',
          'updateDate',
          'enabled'
        ]
    };
    sqlUtil.executeQuery(sqlMapSelect, (err, entities)=> {
      if (err) { return callback(err); }
        callback(null, entities);
    });
} 

api.countEntities = (nlpId, callback) => {
  console.log('HOLAHOLAMUNDO')
  let sqlMapSelect = {
    'table': tableEntity,
    'where': [
      'removed <> 1',
      {
        'nlpEngineId': nlpId
      }
    ],
    'fields': 'count(1) as qt'
  };
  sqlUtil.executeQuery(sqlMapSelect, (err, rows) => {
    if (err) { return callback(err); }
    callback(null, rows[0].qt);
  });
}

api.selectCountByName = (name, nlpId, callback) => {
    let sqlMapSelect = {
      'table': tableEntity,
      'where': [
        'removed <> 1',
        {
          'name': name,
          'nlpEngineId': nlpId
        }
      ],
      'fields': 'count(1) as qt'
    };
    sqlUtil.executeQuery(sqlMapSelect, (err, rows) => {
      if (err) { return callback(err); }
      callback(null, rows[0].qt);
    });
  }

  api.createEntity = (entity, nlpId, callback) => {
    let sqlMapInsert = {
      'table': tableEntity,
      'fields':{
        'name': entity['name'],
        'description': entity['description'],
        'trainingId': null,
        'createDate': new Date(),
        'updateDate': new Date(),
        'nlpEngineId': nlpId,
        'type': entity['type'],
        'pattern': entity['pattern'],
        'removed': '0'
      },
      'type': 'insert'
    };
    sqlUtil.executeQuery(sqlMapInsert, (err) => {
      if (err) { return callback(err); }
      callback();
    });
  }

  api.getEntityById = (entityId, callback) => {
    let sqlMapSelect = {
      'table': tableEntity,
      'fields': [
        'id',
        'name',
        'description',
        'type',
        'pattern',
        'trainingId',
        'createDate',
        'updateDate'
      ],
      'where': [
        {'id':entityId},
        'removed <> 1'
      ]
    };
    sqlUtil.executeQuery(sqlMapSelect, (err, entity) => {
      if(err) { return callback(err); }
      callback(null, entity[0]);
    });
  }

  api.getSystemEntityById = (entityId, callback) => {
    let sqlMapSelect = {
      'table': tableSystemEntity,
      'fields': [
        'trainingId',
        'name',
        'description',
        'jsonMetadata',
        'createDate',
        'updateDate'
      ],
      'where': [
      {'id': entityId}
      ]
    };
    sqlUtil.executeQuery(sqlMapSelect, (err, entity) => {
      if(err) { return callback(err); }
      callback(null, entity[0]);
    })
  }

  api.getSynonym = (simpleId, name, callback) => {
    let sqlMapSelect = {
      'table': tableSynonym,
      'fields': [
        'id',
        'name',
        'createDate',
        'updateDate',
        'trainingId'
      ],
      'where': [
        {'entity_simpleId': simpleId,
          'name': name
        },
        'removed <> 1'
      ]
    };
    sqlUtil.executeQuery(sqlMapSelect, (err, entity) => {
      if(err) { return callback(err); }
      callback(null, entity[0]);
    });
  }

  api.getEntityByName = (entityName, nlpId, callback) => {
    let sqlMapSelect = {
      'table': tableEntity,
      'fields': [
        'id',
        'name',
        'description',
        'type',
        'pattern',
        'trainingId',
        'createDate',
        'updateDate'
      ],
      'where': [
        { 'name': entityName,
          'nlpEngineId': nlpId
        },
        'removed <> 1'
      ]
    };
    sqlUtil.executeQuery(sqlMapSelect, (err, entity) => {
      if(err) { return callback(err); }
      callback(null, entity[0]);
    });
  }

  api.createEntitySimple = (entitySimple, nlpId, callback) => {
    let sqlMapInsert = {
      'table': tableSimple,
      'fields': {
        'name': entitySimple['value'],
        'entityId': entitySimple['entityId'],
        'createDate': new Date(),
        'removed': '0'
      }, 
      'type': 'insert'
    };
    sqlUtil.executeQuery(sqlMapInsert, (err)=> {
      if (err) { return callback(err); }
      callback();
    });
  }

  api.getSimpleByName = (simpleName, callback) => {
    let sqlMapSelect = {
      'table': tableSimple,
      'fields': [
        'id',
        'name',
        'entityId',
        'createDate',
        'updateDate'
      ],
      'where': [
        {
          'name': simpleName
        },
        'removed <> 1'
      ]
    };
    sqlUtil.executeQuery(sqlMapSelect, (err, entitySimple) => {
      if(err) { return callback(err); }
      callback( null, entitySimple[0]);
    });
  }

  api.getSimpleById = (simpleId, callback) => {
    let sqlMapSelect = {
      'table': tableSimple,
      'fields': [
        'id',
        'name',
        'entityId',
        'createDate',
        'updateDate'
      ],
      'where': [
        {
          'id': simpleId
        },
        'removed <> 1'
      ]
    };
    sqlUtil.executeQuery(sqlMapSelect, (err, entitySimple) => {
      if(err) { return callback(err); }
      callback( null, entitySimple[0]);
    });
  }

  api.updateEntity = (entityId, entity, callback) => {
    
    let sqlMapUpdate = {
      'table': tableEntity,
      'fields': {
        'name': entity['name'],
        'description': entity['description'],
        'trainingId': entity['trainingId'],
        'type': entity['type'],
        'pattern': entity['pattern'],
        'updateDate': new Date(),
        'removed': entity['removed']
      },
      'where': {
        'id': entityId,
      },
      'type': 'update'
    };
    sqlUtil.executeQuery(sqlMapUpdate, (err, rows)=> {
      if(err) { return callback(err); }
      callback(null);
    });
  }

  api.updateSystemEntity = (entityId, entity, callback) => {
    let sqlMapUpdate = {
      'table': tableSystemEntity,
      'fields': {
        'enabled': entity['enabled'],
        'updateDate': new Date()
      },
      'where': {
        'id': entityId
      },
      'type': 'update'
    };
    sqlUtil.executeQuery(sqlMapUpdate, (err, rows)=> {
      if(err) { return callback(err); }
      callback(null);
    });
  }

  api.updateSynonym = (name, entity, callback) => {
    let sqlMapUpdate = {
      'table': tableSynonym,
      'fields': {
        'updateDate': new Date(),
        'removed': entity['removed']
      },
      'where': {
        'name': name,
      },
      'type': 'update'
    };
    sqlUtil.executeQuery(sqlMapUpdate, (err, rows)=> {
      if(err) { return callback(err); }
      callback(null);
    });
  }

  api.updateSimple = (simpleId, entity, callback) => {
    console.log('******++++++ SIMPLE ************+'+entity['name']);
    let sqlMapUpdate = {
      'table': tableSimple,
      'fields': {
        'name': entity['name'],
        'updateDate': new Date(),
        'removed': entity['removed']
      },
      'where': {
        'id': simpleId,
      },
      'type': 'update'
    };
    sqlUtil.executeQuery(sqlMapUpdate, (err, rows)=> {
      if(err) { return callback(err); }
      callback(null);
    });
  }

  api.selectCountSimpleByText = (text, callback) => {
    let sqlMapSelect = "select count(1) as qt from entity_simple es, entity e where es.entityId=e.id and es.name='"+text+"' and e.removed<>1";
    sqlUtil.executeSQL(sqlMapSelect, [], (err, rows)=> {
      if(err) {return callback(err);}
      callback(null, rows[0].qt);
    });
  }

  api.selectCountSynonymByText = (text, callback) => {
    let sqlMapSelect = "select count(1) as qt from entity_synonym esy, entity_simple es where esy.entity_simpleId=es.id and esy.name='"+text+"' and esy.removed<>1";
    sqlUtil.executeSQL(sqlMapSelect, [], (err, rows)=> {
      if(err) {return callback(err);}
      callback(null, rows[0].qt);
    });
  }

  api.createEntitySynonym = (entitySynonym, callback) => {
    let sqlMapInsert = {
      'table': tableSynonym,
      'fields': {
        'name': entitySynonym['text'],
        'entity_simpleId': entitySynonym['entity_simpleId'],
        'createDate': new Date(),
        'removed': '0'
      },
      'type': 'insert'
    };
    sqlUtil.executeQuery(sqlMapInsert, (err)=> {
      if (err) { return callback(err); }
      callback();
    });
  }

  api.listSimples = (entityId, callback) => {
    console.log("EN EL DAO: entityId ---> "+entityId);
    let sqlMapSelect = {
        'table': tableSimple,
        'fields': [
            'id',
            'name',
            'createDate',
            'updateDate'
        ],
        'where': [
            {'entityId':entityId},
            'removed <> 1'
        ]
    };
    sqlUtil.executeQuery(sqlMapSelect, (err, simpleEntities)=> {
        if (err) { return callback(err); }
        callback(null, simpleEntities);
    });
  }

  api.listSynonyms = (simpleId, callback) => {
    console.log("DAO SINONIMOS");
    let sqlMapSelect = {
      'table': tableSynonym,
      'fields': [
        'id',
        'name',
        'createDate',
        'updateDate',
        'trainingId'
      ],
      'where': [
        {'entity_simpleId':simpleId},
        'removed <> 1'
      ]
    };
    sqlUtil.executeQuery(sqlMapSelect, (err, entities)=> {
      if(err) { return callback(err); }
      callback(null, entities);
    });
  }

module.exports = api;