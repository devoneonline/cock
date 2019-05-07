/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var sessionAPI = require('../api/sessionAPI'),
    permission = require('../../config/permissions'),
    json2xls = require('json2xls');

module.exports = function(app) {

    app.use(json2xls.middleware);
    app.post('/cockpit/v1/projects/:projectId/session/search', sessionAPI.findSession);
    app.get('/cockpit/v1/projects/:projectId/session/export', sessionAPI.exportSession);
    
    //download-excel
    app.get('/cockpit/v1/projects/:projectId/session/downloads', sessionAPI.getDownloadLinks);
    app.delete('/cockpit/v1/projects/:projectId/session/deleteFile', sessionAPI.deleteFile);
    app.get('/cockpit/v1/projects/:projectId/session/downloadExcel', sessionAPI.downloadExcel);

}


// var api = require('../api/sessionAPI');
// var permissions = require('../../config/permissions');

// module.exports = function(app) {

//     app.post('/cockpit/v1/projects/:projectId/sessions', api.findSessions);

// };