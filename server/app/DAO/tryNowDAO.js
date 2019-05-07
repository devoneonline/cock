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
let tableChannel = 'channel';
let tableCategory = 'channel_classification';

api.listChannels = (projectId, callback) => {
    let sqlMapSelect = {
      'table': tableChannel,
      'fields': [
        'id',
        'name',
        'systemName',
        'classificationId',
        'description'
      ],
      'where': [
        {'projectId': projectId}
      ]
    };
    sqlUtil.executeQuery(sqlMapSelect, (err, channels) => {
        if (err) { 
            return callback(err); 
        }
        callback(null, channels);
    });
}

api.listCategoryChannels = ( idGroups , callback) => {
    let sql = "SELECT id , name FROM "+tableCategory+ " WHERE id IN ("+idGroups.toString()+")";
    sqlUtil.executeSQL(sql , null , (err, category) => {
        if (err) { 
            return callback(err); 
        }
        callback(null, category);
    });
}


module.exports = api;
