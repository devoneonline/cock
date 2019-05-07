/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var apiAnswerStatus = require('../api/answerStatusAPI');
var permissions = require('../../config/permissions');

module.exports = function(app) {

    app.get('/cockpit/v1/answers/status',permissions.any('SEARCH_STATUS'), apiAnswerStatus.selectAllAnswerStatus);
    app.post('/cockpit/v1/answers/status',permissions.any('CREATE_STATUS'), apiAnswerStatus.createAnswerStatus);
    app.put('/cockpit/v1/answers/status/:id',permissions.any('ALTER_STATUS'), apiAnswerStatus.updateAnswerStatus);
    app.delete('/cockpit/v1/answers/status/:id',permissions.any('REMOVE_STATUS'), apiAnswerStatus.deleteAnswerStatus);

};
