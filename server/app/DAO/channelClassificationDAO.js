/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var sqlUtil = require('../sql-util');

var api = {}


//<--------------------------------- SELECT ------------------------------------>
// SELECT ALL CHANNEL CLASSIFICATION IN DATABASE.
api.select = function (callback) {
	
//     var sqlMapSelect = {};
//     sqlMapSelect.table ="channel_classification"; 

//     sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
// 		if (err)
// 			return callback(err);

//         callback(null, rows);
//     });
        	
};

// //SELECT CHANNEL CLASSIFICATION IN DATABASE BY ID
// api.selectChannelClassifById = function (id, callback) {
//     var sqlMapSelect = {
//         "table": "channel_classification",
//         "where": {
//             "id" : id
//         }
//     };
   
//     sqlUtil.executeQuery(sqlMapSelect, function(err, rows) {
// 		if (err)
// 			return callback(err);
        
//         callback(null, rows.length > 0 ? rows[0] : null);
//     });

// };

// api.selectChannelClassifByGroup = function (callback){
//     var sqlMapSelect = {
//         "table": "channel_classification",
//         "orderBy":"groupClassification"
//     };

//     sqlUtil.executeQuery(sqlMapSelect,function(err, rows){
//         if(err)
//             return callback(err);

//         callback(null, rows);
//     });
// }

module.exports = api;