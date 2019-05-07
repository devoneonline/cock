/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var recaptcha = require('../api/recaptchaAPI');

module.exports = function(app) {
    app.post('/recaptcha', recaptcha.valid);
};