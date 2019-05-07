/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var sampleDAO = require('../DAO/sampleDAO');
var error = require('../error/error');

var api = {}


//<--------------------------------- SELECT ------------------------------------>

//SELECT ALL SAMPLE
api.selectAllSamples = function (req, res) {
	var projectId = req.params["projectId"];
	sampleDAO.select(projectId, function (err, samples) {
		error.responseReturnXHR(res, err, samples);
	});
};


//SELECT THE SAMPLE BY ID
// api.selectSampleBychannelId = function (req, res) {
// 	var id = req.params['channelId'];

// 	if (!id)
// 		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"ID deve ser fornecido"}});

// 	sampleDAO.selectSampleById(id, function (err,sample){
// 		if (!err && !sample)
// 			err = {
// 				"status": 204
// 			};
// 		error.responseReturnXHR(res, err, sample);
// 	});
// };




// //SELECT THE SAMPLE BY DATE
// api.selectSampleBydate = function (req, res) {
// 	var date = req.params['date'];

// 	if (!date)
// 		return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"Data deve ser fornecido"}});

// 	sampleDAO.selectSampleByDate(date, function (err,sample){
// 		if (!err && !sample)
// 			err = {
// 				"status": 204
// 			};
// 		error.responseReturnXHR(res, err, sample);
// 	});
// };



//SELECT THE SAMPLE BY DATE AND CHANNELID
api.selectSampleBydateAndChannelId = function (req, res) {
	var projectId = req.params['projectId'];
	var filters = req.body;

	filters.projectId = projectId;
 	
	if(!filters.maxResults)
        filters.maxResults = 20;
    
    if(!filters.page)
        filters.page = 1;

	if(filters.maxResults > 100)
        filters.maxResults = 100;

	if(!filters.startDate)
        filters.createDateIni = `01/0${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

    if(!filters.endDate)
        filters.createDateEnd = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

	console.log("Valor  filters.page = ", filters.page);

	filters.firstResult = (filters.page - 1) * filters.maxResults;

	console.log("Valor  filters.maxResults = ", filters.maxResults);
	console.log("Valor  filters.firstResult = ", filters.firstResult);

	sampleDAO.selectSampleBydateAndChannelId(filters, function(err, sample){
        if(err) 
            return error.responseReturnXHR(res, err);

        sampleDAO.selectCountByDateAndChannelId(filters, function(err, count){
            error.responseReturnXHR(res, err, {
                samples:sample,
                count:count.qt,
                resultsPerPage:filters.maxResults,
                page:filters.page,
				sumSamples:count.sumSamples,
				avgAssertiveness:count.avgAssertiveness
            });
        });
    });


	
};



//<--------------------------------- INSERT ------------------------------------>

//CREATE SAMPLE
api.createSample = function (req, res) {
	var sample = req.body;

	if (!sample.createDate)
		return res.status(400).end('{"message":"Data da amostra deve ser fornecida"}'); //TODO: internacionalizar erros
	if (!sample.channelId)
		return res.status(400).end('{"message":"Canal da amostra deve ser fornecido"}'); //TODO: internacionalizar erros
	if (!sample.sampleBulk)
		return res.status(400).end('{"message":"Quantidade da amostra deve ser fornecido"}'); //TODO: internacionalizar erros
	if (!sample.sampleAssertivenessPercentage)
		return res.status(400).end('{"message":"Porcentagem de assertividade da amostra deve ser fornecido"}'); //TODO: internacionalizar erros

	sample.createDate = sample.createDate.split('-').reverse().join('-');

	// if(typeof sample.sampleBulk != 'number')
	// 	return res.status(400).end('{"message":"Quantidade da amostra deve ser numerico"}'); //TODO: internacionalizar erros
	// if(typeof sample.sampleAssertivenessPercentage != 'number')
	// 	return res.status(400).end('{"message":"Porcentagem de assertividade deve ser numerico"}'); //TODO: internacionalizar erros


	sampleDAO.selectCountByDateAndChannelId(sample, function(err, count){
		if (err)
			return error.responseReturnXHR(res, err);
		
		if (count > 0)
			return error.responseReturnXHR(res, {"status":400, "returnObj":{"message":"Já existe canal cadastrado nesse dia"}}); //TODO: internacionalizar erros
		
		sampleDAO.insert(sample, function (err){
			error.responseReturnXHR(res, err);
		});
	});
};






//<--------------------------------- UPDATE ------------------------------------>
api.updateSample = function (req, res) {

	var sample = req.body;
	sample.createDate = req.params['createDate'];
	sample.channelId = req.params['channelId'];

	if (!sample.createDate)
		return res.status(400).end('{"message":"Data da amostra deve ser fornecida"}'); //TODO: internacionalizar erros
	if (!sample.channelId)
		return res.status(400).end('{"message":"Canal da amostra deve ser fornecido"}'); //TODO: internacionalizar erros

	sample.createDate = sample.createDate.split('-').reverse().join('-');
	
	sampleDAO.update(sample, function (err) {
		error.responseReturnXHR(res, err);
	});
	
};




//<--------------------------------- EXPORT ------------------------------------>
api.exportSample = function(req, res) {
    var projectId = req.params['projectId'];
    var filters = {};    
    filters.export = true;

	filters.projectId = projectId;

    if (req.query['channelId'])
        filters.channelId = JSON.parse(req.query['channelId']);

    if (req.query['startDate'])
        filters.startDate = req.query['startDate'];

    if (req.query['endDate'])
        filters.endDate = req.query['endDate'];

    sampleDAO.selectSampleBydateAndChannelId(filters, function(err, sessions){
        if(err) 
            return error.responseReturnXHR(res, err);
        
        for(i in sessions)
            sessions[i].createDate = `${sessions[i].createDate.getDate()}/${sessions[i].createDate.getMonth() + 1}/${sessions[i].createDate.getFullYear()} - ${sessions[i].createDate.getHours()}:${sessions[i].createDate.getMinutes()}`;

        res.xls('data.xlsx', sessions);
        res.end();
    });
}




module.exports = api;

