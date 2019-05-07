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
let tableIntent = 'intent';
let tableExample = 'intent_example';

api.listIntents = (nlpId, callback) => {
  let sqlMapSelect = {
    'table': tableIntent,
    'fields': [
      'id',
      'name',
      'description',
      'trainingId',
      'createDate',
      'updateDate',
      'enable'
    ],
    'where': [
      {'nlpEngineId': nlpId},
      // {'nlpEngineId': null},
      'removed <> 1'
    ]
  };
  sqlUtil.executeQuery(sqlMapSelect, (err, intents) => {
		if (err) { return callback(err); }
    callback(null, intents);
  });
}

api.listEnableIntents = (nlpId, isEnable, callback) => {
  let sqlMapSelect = {
    'table': tableIntent,
    'fields': [
      'id',
      'name',
      'description',
      'trainingId',
      'createDate',
      'updateDate',
       'enable'
    ],
    'where': [
      {'nlpEngineId': nlpId},
      'removed <> 1'
       ,`enable = ${isEnable}`
    ]
  };
  sqlUtil.executeQuery(sqlMapSelect, (err, intents) => {
		if (err) { return callback(err); }
    callback(null, intents);
  });
}

api.getIntentById = (intentId, callback) => {
  let sqlMapSelect = {
    'table': tableIntent,
    'fields': [
      'id',
      'name',
      'description',
      'trainingId',
      'createDate',
      'updateDate',
      'nlpEngineId',
      'enable'
    ],
    'where': [
      {'id': intentId},
      'removed <> 1'
    ]
  };
  sqlUtil.executeQuery(sqlMapSelect, (err, intent) => {
    if (err) { return callback(err); }
    callback(null, intent[0]);
  });
}

api.getIntentByName = (intentName, nlpId, callback) => {
  let sqlMapSelect = {
    'table': tableIntent,
    'fields': [
      'id',
      'name',
      'description',
      'trainingId',
      'createDate',
      'updateDate',
      'nlpEngineId',
      'enable'
    ],
    'where': [
      {
        'name': intentName,
        // 'nlpEngineId': null
        'nlpEngineId': nlpId
      },
      'removed <> 1'
    ]
  };
  sqlUtil.executeQuery(sqlMapSelect, (err, intent) => {
    if (err) { return callback(err); }
    callback(null, intent[0]);
  });
}

api.createIntent = (intent, nlpId, callback) => {
  let sqlMapInsert = {
    'table': tableIntent,
    'fields':{
      'name': intent['name'],
      'description': intent['description'],
      'trainingId': null,
      'createDate': new Date(),
      'updateDate': null,
      'nlpEngineId': nlpId,
      'removed': '0',
      'enable': intent['enable']==undefined ? true : intent['enable'],
      'modified': '1'
    },
    'type': 'insert'
  };
  sqlUtil.executeQuery(sqlMapInsert, (err) => {
    if (err) { return callback(err); }
    callback();
  });
}

api.updateIntent = (intentId, intent, callback) => {
  let sqlMapUpdate = {
    'table': tableIntent,
    'fields': {
      'name': intent['name'],
      'description': intent['description'],
      'trainingId': intent['trainingId'],
      'updateDate': new Date(),
      'removed': intent['removed'],
      'enable': intent['enable'],
      'modified': '1'
    },
    'where': {
      'id': intentId,
    },
    'type':'update'
  };
  sqlUtil.executeQuery(sqlMapUpdate, (err, rows) => {
    if (err) { return callback(err); }
    callback(null);
  });
}

api.selectCountByName = (name, nlpId, callback) => {
  let sqlMapSelect = {
    'table': tableIntent,
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

api.selectCountById = (id, callback) => {
  let sqlMapSelect = {
    'table': tableIntent,
    'where': {
      'id': id
    },
    'fields': 'count(1) as qt'
  };
  sqlUtil.executeQuery(sqlMapSelect, (err, rows) => {
    if (err) { return callback(err); }
    callback(null, rows[0].qt);
  });
}

api.listIntentExample = (intentId, callback) => {
  let sqlMapSelect = {
    'table': tableExample,
    'fields': [
      'id',
      'text',
      'nlpEngineId',
      'intentId',
      'createDate',
      'updateDate'
    ],
    'where': [
      {'intentId': intentId},
      'removed <> 1'
    ]
  };
  sqlUtil.executeQuery(sqlMapSelect, (err, intentsExample) => {
		if (err) { return callback(err); }
    callback(null, intentsExample);
  });
}

api.createIntentExample = (intentExample, nlpId, callback) => {
  let sqlMapInsert = {
    'table': tableExample,
    'fields':{
      'text': intentExample['text'],
      'intentId': intentExample['intentId'],
      'nlpEngineId': nlpId,
      'createDate': new Date(),
      'updateDate': null,
      'removed': '0',
      'modified': '1'
    },
    'type': 'insert'
  };
  sqlUtil.executeQuery(sqlMapInsert, (err) => {
    if (err) { return callback(err); }
    callback();
  });
}

api.selectCountExampleByText = (text, nlpId, callback) => {
  let sqlMapSelect = "select count(1) as qt from intent_example ie, intent i where ie.intentId=i.id and ie.text='"+text+"' and ie.nlpEngineId='"+nlpId+"' and i.removed<>1";
  sqlUtil.executeSQL(sqlMapSelect, [], (err, rows) => {
    if (err) { return callback(err); }
    callback(null, rows[0].qt);
  });
}

api.getExampleById = (exampleId, callback) => {
  let sqlMapSelect = {
    'table': tableExample,
    'fields': [
      'id',
      'intentId',
      'text',
      'createDate',
      'updateDate',
      'nlpEngineId'
    ],
    'where': {
      'id': exampleId
    }
  };
  sqlUtil.executeQuery(sqlMapSelect, (err, example) => {
    if (err) { return callback(err); }
    callback(null, example[0]);
  });
  // selectCountExampleById
  // let sqlMapSelect = {
  //   'table': tableExample,
  //   'where': {
  //     'id': exampleId
  //   },
  //   'fields': 'count(1) as qt'
  // };
  // sqlUtil.executeQuery(sqlMapSelect, (err, rows) => {
  //   if (err) { return callback(err); }
  //   callback(null, rows[0].qt);
  // });
}

api.deleteIntentExample = (id, callback) => {
  let sqlMapDelete = {
    'table': tableExample,
    'where': {
      'id': id,
    },
    'type':'delete'
  };
  sqlUtil.executeQuery(sqlMapDelete, (err, rows) => {
    if (err) { return callback(err); }
    callback(null);
  });
}

module.exports = api;
