/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
let apiEntity = require('../api/entityAPI');
var permissions = require('../../config/permissions');

module.exports = function(app) {
    app.get('/cockpit/v1/nlp/:nlpId/entities/', apiEntity.listEntities);
    app.get('/cockpit/v1/entities/', apiEntity.listSystemEntities);
    app.get('/cockpit/v1/nlp/:nlpId/', apiEntity.countEntities);
    app.post('/cockpit/v1/nlp/:nlpId/entities/', apiEntity.createEntity);
    app.delete('/cockpit/v1/entities/:entityId', apiEntity.deleteEntity);
    app.get('/cockpit/v1/nlp/:nlpId/entities/:entityName', apiEntity.getEntityByName);
    app.post('/cockpit/v1/nlp/:nlpId/simple', apiEntity.createEntitySimple);
    app.get('/cockpit/v1/simple/:simpleName', apiEntity.getSimpleByName);
    app.post('/cockpit/v1/simple/:simpleId/synonym', apiEntity.createEntitySynonym);
    app.get('/cockpit/v1/entities/:entityId/simple', apiEntity.listSimples);
    app.get('/cockpit/v1/nlp/:nlpId/simple/:simpleId', apiEntity.listSynonyms);
    app.delete('/cockpit/v1/simple/:simpleId/synonym/:synonymName', apiEntity.deleteSynonym);
    app.delete('/cockpit/v1/simple/:simpleId', apiEntity.deleteSimple);
    app.put('/cockpit/v1/simple/:simpleId', apiEntity.updateSimple);
    app.put('/cockpit/v1/entities/:entityId', apiEntity.updateEntity);
    app.put('/cockpit/v1/entities/', apiEntity.updateSystemEntity);
  };