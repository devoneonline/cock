/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
let apiIntent = require('../api/intentAPI');
var permissions = require('../../config/permissions');

module.exports = function(app) {
  app.get('/cockpit/v1/nlp/:nlpId/intents/', apiIntent.listIntents);
  app.get('/cockpit/v1/intents/:intentId', apiIntent.getIntentById);
  app.get('/cockpit/v1/nlp/:nlpId/intents/:intentName', apiIntent.getIntentByName);
  app.post('/cockpit/v1/nlp/:nlpId/intents/', apiIntent.createIntent);
  app.delete('/cockpit/v1/intents/:intentId', apiIntent.deleteIntent);
  app.put('/cockpit/v1/intents/:intentId', apiIntent.updateIntent);
  app.get('/cockpit/v1/examples/:intentId', apiIntent.listIntentExample);
  app.post('/cockpit/v1/nlp/:nlpId/examples', apiIntent.createIntentExample);
  app.delete('/cockpit/v1/examples/:exampleId', apiIntent.deleteIntentExample);
  app.post('/cockpit/v1/nlp/:nlpId/check-examples', apiIntent.checkIntentExample);
  app.get('/cockpit/v1/nlp/:nlpId/enable/:enable/intents', apiIntent.listEnableIntents);
};
