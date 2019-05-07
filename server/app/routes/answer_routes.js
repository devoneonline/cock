/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var apiAnswer = require('../api/answerAPI');
var permissions = require('../../config/permissions');
var json2xls = require('json2xls');

module.exports = function(app) {
    
    app.use(json2xls.middleware);
    app.post('/cockpit/v1/answers/search/:projectId',permissions.any('SEARCH_ANSWER'), permissions.projectParam(), apiAnswer.searchAnswers);
    app.post("/cockpit/v1/answers/select-distinct-faq-name/:projectId",permissions.any('SEARCH_ANSWER'),permissions.projectParam(),apiAnswer.selectFaqOfAnswer);
    app.post("/cockpit/v1/answers/select-distinct-code/:projectId",permissions.any('SEARCH_ANSWER'),permissions.projectParam(),apiAnswer.selectCodeOfAnswer);
    app.get('/cockpit/v1/answers/:locale/directories/:directoryId/projects/:projectId',permissions.any('SEARCH_ANSWER'),permissions.projectParam() ,apiAnswer.selectAnswerByDirectory);
    app.get('/cockpit/v1/answers/:locale/:code/projects/:projectId',permissions.any('SEARCH_ANSWER'), permissions.projectParam(),apiAnswer.selectAnswerByCode);
    app.delete('/cockpit/v1/answers/:locale/:code/projects/:projectId',permissions.any('PROCESS_ANSWER'),permissions.projectParam() ,apiAnswer.deleteAnswersByCode);
    app.post('/cockpit/v1/answers',permissions.any('PROCESS_ANSWER'), apiAnswer.processAnswers);
    app.delete('/cockpit/v1/answers/:id',permissions.any('PROCESS_ANSWER'), apiAnswer.deleteAnswer);
    app.get("/cockpit/v1/answers/:locale/:projectId/export", apiAnswer.exportAnswer);
    app.post("/cockpit/v1/answers/:projectId/:code", apiAnswer.updateActiveGroup);
    

    app.get("/cockpit/v1/answers/codes-titles", apiAnswer.codesAndTitles);

};
