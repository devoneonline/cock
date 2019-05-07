/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var apiCache = require('../api/cacheAPI');

module.exports = function(app) {
  app.get('/cockpit/v1/cachecleaner', apiCache.callCache);
  app.get('/cockpit/v1/cachecleanerprojects', apiCache.callCacheProjects);
};
