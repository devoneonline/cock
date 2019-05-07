/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/

var channelClassificationDAO = require('../DAO/channelClassificationDAO');
var error = require('../error/error');

var api = {}



//<--------------------------------- SELECT ------------------------------------>


//SELECT ALL CHANNELS
api.selectAllChannelClassification = function (req, res) {
	channelClassificationDAO.select(function (err, channels) {
		error.responseReturnXHR(res, err, channels);
	});
};



//SELECT THE CHANNEL BY ID
api.selectChannelClassificationById = function (req, res) {
	var id = req.params['id'];

	if (!id)
		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"ID deve ser fornecido"}});

	channelClassificationDAO.selectChannelClassifById(id, function (err,channel){
		if (!err && !channel)
			err = {
				"status": 204
			};
		error.responseReturnXHR(res, err, channel);
	});
};

// //SELECT THE CHANNEL BY GROUP CLASSIFICATION
// api.selectChannelClassificationByGroup = function (req, res) {
// 	channelClassificationDAO.selectChannelClassifByGroup(function (err, channels) {
// 		error.responseReturnXHR(res, err, channels);
// 	});
// }

module.exports = api;