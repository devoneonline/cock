/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var ivrAPI = require('../api/ivrAPI');

module.exports = function(app) {
    app.get('/ura/v1/ivr/human-redirect/:phoneNumber/open', ivrAPI.humanRedirectOpen);
    app.get('/ura/v1/ivr/human-redirect/:phoneNumber/close', ivrAPI.humanRedirectClose);
    app.get('/ura/v1/ivr/has-redirection', ivrAPI.hasRedirection);
    app.get('/ura/v1/ivr/projects', ivrAPI.projects);
};