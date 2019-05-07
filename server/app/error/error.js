/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var api = {}

api.status = function (err) {

        if (err) {
                if (err.status) {
                     return err.status;
                }
            return 500;
        } 
     

 return 200;

}

api.setContentType = function(res, obj) {
    if (obj && obj.substring)
        res.setHeader('Content-type', 'text/plain');
    else
        res.setHeader('Content-type', 'application/json');
}

api.responseReturnXHR = function(res, err, successResponse) {
    var status = 200;
    if (err) {
        var ret = err;
        if (err.status) {
            status = err.status;
            ret = err.returnObj;
        } else {
            status = 500;
        }

        api.setContentType(res, ret);
        if (ret && !ret.substring)
            ret = JSON.stringify(ret);
        
        return res.status(status).end(ret);
    }

    successResponse = successResponse == '' || successResponse == 0 || successResponse ? successResponse : 'OK';
    api.setContentType(res, successResponse);
    if (!successResponse.substring)
        successResponse = JSON.stringify(successResponse);
    
    res.status(status).end(successResponse);
}

api.errorResponse = function(req, res, err) {
    if (req.xhr) {
        return api.responseReturnXHR(res, err);
    }

    res.status(500).end('error...'); //TODO - mudar para pagina real de erro
}

module.exports = api;