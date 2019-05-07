/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var apiAnswerDirectory = require('../api/answer_directoryAPI');
var permissions = require('../../config/permissions');

module.exports = function(app) {

    app.get('/cockpit/v1/answers/:projectId/directories/:id/load-content', permissions.any('SEARCH_DIRECTORY'), apiAnswerDirectory.selectDirectoryContent);
    app.get('/cockpit/v1/answers/:projectId/directories/', permissions.any('SEARCH_DIRECTORY'), apiAnswerDirectory.selectRootDirectories);
    app.post('/cockpit/v1/answers/:projectId/directories', permissions.any('CREATE_DIRECTORY'), apiAnswerDirectory.createAnswerDirectory);
    app.put('/cockpit/v1/answers/:projectId/directories/:id', permissions.any('ALTER_DIRECTORY'), apiAnswerDirectory.updateAnswerDirectory);
    app.delete('/cockpit/v1/answers/:projectId/directories/:id', permissions.any('REMOVE_DIRECTORY'), apiAnswerDirectory.deleteAnswerDirectory);

}