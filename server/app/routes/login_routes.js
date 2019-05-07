/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var configurationDAO = require('../DAO/configurationDAO');

module.exports = function(app) {

    app.get('/',function(req, res) {
        
        var configKey = "cockpit.recaptcha.sitekey";
        configurationDAO.selectConfigurationByConfigKey(configKey, function(err, config){
            if(err) {
                return res.status(500).end('error loading recaptcha');
            }
            console.log(config);
    
            res.render('index', {recaptchaKey:config?config.configValue:false});
        });
            
    });

};
