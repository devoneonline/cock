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
var table = 'answer_directory';

//<--------------------------------- SELECT ------------------------------------>

//SELECT ANSWER_DIRECTORY IN DATABASE BY ID
api.getAnswerDirectoryById = function (id, callback) {
    var sqlMapSelect = {
        'table': table,
        'where': {
            'id': id
        }
    };
    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
		if (err) { return callback(err);}
        callback(null, rows[0]);
    });
 }

//SELECT ANSWER_DIRECTORY IN DATABASE BY PARENTID
api.selectAnswerDirectoryByParentId = function (projectId, parentId, callback) {
    if (typeof(parentId) == 'function') {
        callback = parentId;
        parentId = null;
    }
    var sqlMapSelect = {
        "table": table,
        "where": [
            "removed <> 1"
        ]
    };
    if (projectId) {
        sqlMapSelect.where.push({"projectId":projectId});
    }
    if (parentId) {
        sqlMapSelect.where.push({"parentId":parentId});
    } else {
        sqlMapSelect.where.push("parentId is null");
    }
    sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
		if (err) { return callback(err); }
        callback(null, rows);
    });
        	
};

api.selectCountByName = function (projectId, name, id, callback) {
  var sqlMapSelect = {
    "table": "answer_directory",
    "where": [
        { "name": name },
        { "projectId": projectId },
        'removed <> 1'
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

//<------------------------------- INSERT ----------------------------------->
//VALIDADE IF EXISTS ANSWER_DIRECTORY IN DATABASE AND INSERT BY PARM sqlMapInsert
api.insert = function (answerdirectory, callback) {
    var sqlMapInsert = {
        "table": "answer_directory",
        "fields":{
                "name": answerdirectory.name,
                "parentId": answerdirectory.parentId,
                "projectId": answerdirectory.projectId,
                "removed": answerdirectory.removed
            },
        "type":"insert"
        };


    sqlUtil.executeQuery(sqlMapInsert, function(err, rows) {
        if (err)
            return callback(err);
        return callback();
    });
};

//<--------------------------------- UPDATE ------------------------------------>
// UPDATE ANSWER DIRECTORY FIELDS
api.update = function(answerdirectory, callback) {
  var sqlMapUpdate = {
    'table': table,
    "fields":{
      "name": answerdirectory.name,
      "projectId": answerdirectory.projectId,
      "removed": answerdirectory.removed
    },
    'where': {
      'id': answerdirectory.id
    },
    'type':'update'
  };
  sqlUtil.executeQuery(sqlMapUpdate, function(err, rows) {
    if (err) { return callback(err); }
    callback();
  });
};

//<--------------------------------- DELETE ------------------------------------>
// CHANGE REMOVED FIELD OF ONE OR MORE ANSWER_DIRECTORY
api.updateRemoved = function (ids, removed, callback) {
    var sqlMapUpdate = {
        'table': table,
        "fields": {
            "removed": removed
        },
        'where': [],
        'type':'update'
    };

    if (ids.push) {
        let idList = '';
        for (i in ids) {
            idList += "'" + ids[i] + "',";
        }
        idList = idList.substring(0, idList.length-1);
        sqlMapUpdate.where.push("id in (" + idList + ")");
    } else {
        sqlMapUpdate.where.push({"id": ids});
    }

    sqlUtil.executeQuery(sqlMapUpdate, function(err, rows) {
		if (err) { return callback(err); }
        callback();
    });
}

module.exports = api;
