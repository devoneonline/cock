/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var apiSample = require('../api/sampleAPI'),
    permissions = require('../../config/permissions'),
    json2xls = require('json2xls');


module.exports = function(app) {
    app.use(json2xls.middleware);

    //Select All Samples
    app.get('/cockpit/v1/projects/:projectId/samples', apiSample.selectAllSamples);
    //Select Samples by PARMS
    app.post('/cockpit/v1/projects/:projectId/samples/search',apiSample.selectSampleBydateAndChannelId);

    //Export Samples by PARMS
    app.get('/cockpit/v1/projects/:projectId/samples/export', apiSample.exportSample);
    
    //Create Sample
    app.post('/cockpit/v1/samples',apiSample.createSample);

    //Alter Sample
    app.put('/cockpit/v1/samples/channelId/:channelId/date/:createDate',apiSample.updateSample);

};

