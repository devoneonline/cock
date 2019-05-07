/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var apiMail = require('../api/mailAPI');

module.exports = function(app) {
    app.post('/v1/send', apiMail.sendEmail);
    app.get('/v1/validate-token/:token', apiMail.validateToken);
    app.post('/v1/changePassword', apiMail.changePassword);
    app.get('/v1/getsitekey',apiMail.getSitekey);
};