/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/ 

const http = require('http');
var configurationDAO = require('../DAO/configurationDAO');
var error = require('../error/error');
var api = {};

api.callCache = (req, res) => {
	var configKey = 'cache.cleaner.url';
    configurationDAO.selectConfigurationByConfigKey(configKey, (err, RowDataPacket) => {
		let url = RowDataPacket['configValue'];
        if (err || !url) {
            return error.responseReturnXHR(res, err);
        }else {
			url = url + "/cache/clear-answers";
		}
		http.get(url,
			(resp) => {
				console.log('========== ========== ========== callCache ========== ========== ==========');
				console.log(resp);
				console.log('========== ========== ========== callCache ========== ========== ==========');
				return error.responseReturnXHR(res, null);
			}
		).on("error",
			(err) => {
				console.log(err);
				console.log('erro no call cache');
				return error.responseReturnXHR(res, err);
			}
		);
	});
};


api.callCacheProjects = (req, res) => {
	var configKey = 'cache.cleaner.url';
    configurationDAO.selectConfigurationByConfigKey(configKey, (err, RowDataPacket) => {
		let url = RowDataPacket['configValue'];
        if (err || !url) {
            return error.responseReturnXHR(res, err);
        }else {
			url = url + "/cache/reset-projects-channels";
		}
		http.get(url,
			(resp) => {
				console.log('========== ========== ========== callCache ========== ========== ==========');
				console.log(resp);
				console.log('========== ========== ========== callCache ========== ========== ==========');
				return error.responseReturnXHR(res, null);
			}
		).on("error",
			(err) => {
				console.log(err);
				console.log('erro no call cache');
				return error.responseReturnXHR(res, err);
			}
		);
	});
};



module.exports = api;
