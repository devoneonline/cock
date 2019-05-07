/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var error = require('../error/error');
var configurationDAO = require('../DAO/configurationDAO');
// const express = require('express');
// const bodyParser = require('body-parser');
const request = require('request');

var api = {}

api.valid = function (req, res) {
  if(
    req.body.data === undefined ||
    req.body.data === '' ||
    req.body.data === null
    ) {
      // return res.json({"success": false, "msg":"Please select captcha"});
      return res.status(200).end("false");
  }
     var configKey = "cockpit.recaptcha.secretkey";
      configurationDAO.selectConfigurationByConfigKey(configKey, function(err, config){
        if (err || !config) {
             
        }else{

      // Secret Key
       const secretKey = config["configValue"];
      // Verify URL
      const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.data}`;
      // const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

      // Make Request To VerifyURL
      request(verifyUrl, (err, response, body) => {
      body = JSON.parse(body);

  // If Not Successful
      if(body.success !== undefined && !body.success) {
            return error.responseReturnXHR(res, null, {"valid":false});
      } else {
            return error.responseReturnXHR(res, null, {"valid":true});
   }          
    });    
        }
    });




  
}

module.exports = api;