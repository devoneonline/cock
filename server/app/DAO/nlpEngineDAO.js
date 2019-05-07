/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
const sqlUtil = require('../sql-util')
const api = {}

// <--------------------- SELECT -------------------->

api.selectNlpEngine = function(nlpEngineId, callback) {
    let ids = '';
    for (let i = 0; i < nlpEngineId.length; i++) {
        ids += nlpEngineId[i] + (i+1 < nlpEngineId.length ? ',' : '');
    }
    const sqlMapSelect = {
        "table": "nlp_engine",
        "fields": "nlp",
        "where": `id in (${ids})`
    }


    console.log('ids: ', ids);

    sqlUtil.executeQuery(sqlMapSelect, (err, rows) => {
        if(err) return callback(err)
        callback(null, rows);
    })
}

module.exports = api