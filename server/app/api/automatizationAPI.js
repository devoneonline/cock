/*
* eVA
* Version: 2.0
* copyright (c) 2018 everis Spain S.A
* Date: 06 February 2019
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Oscar Carantón, Aric Gutierrez.
* All rights reserved
*/ 

var xlsLibrary = require('xlsx');
var requestURL = require("request");
var error = require('../error/error');
var automatizationDao = require('../DAO/automatizationDAO');

var url_broker = "https://everis-col-eva-broker.azurewebsites.net/conversations/";
var url_version = "https://everis-col-eva-broker.azurewebsites.net/version/";
var api = {};
var propertiesTest = ["INTENT","DESCRIPTION","DATA","QUESTION","ANSWER"];

api.validationPropertyFlag =  function(callback){
    automatizationDao.verifyFlag(function(error , response){
        console.log(response , error);
        if(response[0]['exist'] == 0){
            console.log("No existe el Flag");
            automatizationDao.createPropertyFlag(function(response){
                callback();
            });
        }else{
            console.log("Ya existe el Flag");
            callback();
        }
    });
}

api.updateAutomatization = function(req , res){
    var test = req.body.test;
    var flag = req.body.flag;
    console.log(test , flag);
    automatizationDao.updateFlagAutomatization(test , flag , function(success, err){
        if(err){
            return error.responseReturnXHR(success, err);
        }else{
            return error.responseReturnXHR(res, err, success);
        }
    });
}

/***
 * Funcion que valida exista una propiedad en el arreglo de propiedas
 */
var validationProperty = function(value){
    return propertiesTest.indexOf(value) > -1;
}
/**
 * Funcion que consolida las validaciones del excel
 */
var validationFile = function(arrayData){
    var objectResponse = [];
    //limpieza de la data leida en el excel
    for(var ejeY = 1 ; ejeY < arrayData.length ; ejeY ++){
        if(arrayData[ejeY].length > 0 ){
            var obj = {};
            for(var ejeX = 0 ; ejeX < arrayData[ejeY].length ; ejeX ++){
                //Validacion de la propiedad existente
                if(validationProperty(arrayData[0][ejeX])){
                    obj[arrayData[0][ejeX]] = (arrayData[ejeY][ejeX] || '');
                }
            }
            //Si el elemento tiene la misma cantidad de propiedades que se requieren se acepta
            if(Object.keys(obj).length == propertiesTest.length){
                objectResponse.push(obj);
            }
        }
    }
    return objectResponse;
}
/**
 * Funcion que realiza la validacion, y el envio del excel para su respectivo guardado en db
 */
api.saveFile = function(req,res,next){
    let wb = xlsLibrary.readFile(req.file.destination + req.file.filename, {
        type: "binary"
    });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    let arrayData = [];
    arrayData = validationFile ( xlsLibrary.utils.sheet_to_json(ws, { header: 1 }));
    if(arrayData.length > 0){
        let object = {
            user : req.user,
            project : req.body.project,
            channel : req.body.channel,
            nameTest : req.body.nameTest,
            detail : arrayData
        }
        automatizationDao.saveAutomatization(object , function(err , success){
            if(err){
                return error.responseReturnXHR(success, err);
            }else{
                // return error.responseReturnXHR(success, {'status':200, 'returnObj':{'message':'insert valido'}});
                return error.responseReturnXHR(res, err, success);
            }
        });
    }else{
        return error.responseReturnXHR(res, {'status':501, 'returnObj':{'message':'The file is incorrect'}});
    }
}
/**
 * Funcion que realiza la paginacion para el servicio de automatizacion en test y en detalle
 */
api.pagination = function(req,res){
    var page = req.params['page'];
    var service = req.params['service'];
    if(service == 'detail'){
        var id = req.params['id'];
        var filter = req.params['filter'];
        automatizationDao.selectDetailAutomatization(id, page , filter, function(err , success){
            if(err){
                return error.responseReturnXHR(success, err);
            }else{
                return error.responseReturnXHR(res, err, success);
            }
        });
    }else if (service == 'test'){
        var id = req.params['id'];
        api.validationPropertyFlag(function(){
            automatizationDao.selectTestAutomatization(id , page, function(err , success){
                if(err){
                    return error.responseReturnXHR(success, err);
                }else{
                    return error.responseReturnXHR(res, err, success);
                }
            });
        }) 
    }else{
        return error.responseReturnXHR(res, {'status':501, 'returnObj':{'message':'The service is incorrect'}});
    }
}

/**
 * Funcion para realizar la consulta del detalle de la prueba
 * **/
api.executeTest = function(req , res){
    var test = req.body.test || '';
    if(test != '' && test){
        var data = {
            project : '',
            channel : '',
            language : '',
            session : '',
            text : '',
            headers : {},
            code : ''
        }
        automatizationDao.searchDetailPropertyTest(test , function(err , success){
            if(err){
                return error.responseReturnXHR(err, success);
            }else{
                data.project = success[0]['nameProject'];
                data.channel = success[0]['nameChannel'];
                data.language = success[0]['localeProject'];
                automatizationDao.searchDetailTest(test , function(err , success){
                    if(err){
                        return error.responseReturnXHR(err, success);
                    }else{
                        api.searchVersionProject(data.project , function(error , body){
                            if (!error) {
                                valueResp = (JSON.parse(body) ).result;
                            }
                            else {
                                valueResp = '';
                            }
                            automatizationDao.updateVersionTest(valueResp , test , function(err , sucess){
                                if(err){
                                    console.log("error", err);
                                }
                                api.recursiveSendBroker(data , success , 0 , res);
                            });
                            
                        });
                    }
                });
            }
        });
    }else{
        return error.responseReturnXHR(res, {'status':501, 'returnObj':{'message':'The service is incorrect'}});
    }
}
/**
 * Funcion para consultar el servicio de validación
 */
api.searchVersionProject = function(project , callback){
    var options = {
        "uri" : url_version,
        "method":"GET",
        "headers":{
            "PROJECT" : project
        }
    }
    requestURL(options, function (error, response, body) {
        callback( error , body);
    });
}   

/**
 * Funcion para realizar la recursividad de las llamadas a los servicios 
 **/
api.recursiveSendBroker = function(dataSend , arrayData , index , res , err ){
    if(index < arrayData.length){
        dataSend.code = (arrayData[index].intent)? arrayData[index].intent:'';
        dataSend.text = (arrayData[index].utterance)? arrayData[index].utterance:'';
        dataSend.code = (arrayData[index].utterance)? '':dataSend.code;
        dataSend.headers = api.validationFielData(arrayData[index].data , dataSend);
        api.sendBroker(dataSend , function(error){
                return error.responseReturnXHR(res, {'status':501, 'returnObj':{'message':'The service is incorrect'}});
            } , function(success){
                if( !success.hasOwnProperty('identificationCode') ){
                    dataSend.session = success.sessionCode
                    arrayData[index].intentResult = success.answers[0].code;
                    arrayData[index].textResult = (success.answers[0].text).replace(/<[^>]*>?/g, '');
                    arrayData[index].confidence = success.answers[0].confidence;
                    var data = {
                        intent : arrayData[index].intentResult,
                        text : arrayData[index].textResult,
                        confidence : arrayData[index].confidence
                    }
                    automatizationDao.saveDetailUpdateAutomatization( arrayData[index].id , data , function(){
                        api.recursiveSendBroker(dataSend , arrayData , (index + 1) , res , err );
                    });
                }else{
                    api.recursiveSendBroker(dataSend , arrayData , (index + 1) , res , err );
                }
                
            });        
    }else{
        api.processTestResult(res, err, arrayData , dataSend);
    }
}
/**
 * Funcion para el tratamiento de la informacion obtenida del broker
 */
api.processTestResult = function(res, errorHttp, arrayData , parameter){
    var totalAssert = 0;
    var objectResponse = {
        data : {
            labels : [],
            grafic : [],
            table : {}
        },
        assert : 0,
        uterrance : arrayData.length,
        pageSelect : 1 ,
        totalPage : 0
    }
    var idTest = 0;
    for(var index = 0 ; index < arrayData.length ; index++){
        idTest = arrayData[index].testId;
        totalAssert = totalAssert + (arrayData[index].confidence * 100)
        objectResponse.data.labels.push(arrayData[index].intent);
        objectResponse.data.grafic.push(arrayData[index].confidence);
    }
    objectResponse.assert= ( totalAssert / arrayData.length );
    
    automatizationDao.selectDetailAutomatization(idTest, 0, 1, function(err , success){
        if(err){
            return error.responseReturnXHR(res, errorHttp);
        }else{
            objectResponse.data.table = success;
            var dataUpdateTest = {
                confidence : objectResponse.assert,
                sessionCode : parameter.session
            };
            automatizationDao.saveTestUpdateAutomatization(idTest , dataUpdateTest , function(err , success){
                if(err){
                    return error.responseReturnXHR(res, errorHttp);
                }else{
                  console.log("errorHttp", errorHttp);
                    return error.responseReturnXHR(res, errorHttp, objectResponse);
                }
            });
        }
    });
}
api.searchDataGraphicsOnly = function(req , res){
    var test = req.body.test || '';
    if(test != ''){
        automatizationDao.selectDetailAutomatizationNoPage(test , function(err , result){
            if(err){return error.responseReturnXHR(res, {'status':501, 'returnObj':{'message':'The service has an error'}});}
            var arrayData = result;
            var totalAssert = 0;
            var objectResponse = {
                data : {
                    labels : [],
                    grafic : [],
                    table : {}
                },
                assert : 0,
                uterrance : arrayData.length,
                pageSelect : 1 ,
                totalPage : 0
            }
            for(var index = 0 ; index < arrayData.length ; index++){
                idTest = arrayData[index].testId;
                totalAssert = totalAssert + (arrayData[index].confidence * 100)
                objectResponse.data.labels.push(arrayData[index].intent);
                objectResponse.data.grafic.push(arrayData[index].confidence);
            }
            objectResponse.assert= ( totalAssert / arrayData.length );
            return error.responseReturnXHR(res, null ,objectResponse);
        });
    }else{
        return error.responseReturnXHR(res, {'status':501, 'returnObj':{'message':'The service is incorrect'}});
    }
}
/**
 * Api para la validación de las cabeceras de las peticiones al broker de la información
 */
api.validationFielData = function(field , data){
    field = field.trim();
    var headersTemp = field.split(','); 
    var object = {
        "content-type": "application/json",
        "API-KEY" : 0,
        "PROJECT" : data.project,
        "CHANNEL" : data.channel,
        "OS" : "NodeJs",
        "LOCALE" : data.language,
        "BUSINESS-KEY" : '',
        "USER-REF" : "webdomain",
        "ATTEMPT" : 1
    }
    for(var index = 0 ; index < headersTemp.length ; index ++){
        var tmp = headersTemp[index].split('=');
        if(tmp[0] != '' && tmp[1]){
            object[tmp[0]] = tmp[1];
        }
    }
    return object; 
}
/**
 *  Funcion para el consumo de la api del broker para la prueba
 */
api.sendBroker = function (data , errorCallback , successCallback){
    let url = url_broker + ( (data.session) ? data.session :'');
    var headers = data.headers;
    var postData = {
        "headers": headers,
        "url": url,
        "body": JSON.stringify({
            "text":(data.text),
            "code":(data.code)
        })
    };   
    requestURL.post( postData , (error, response, body) => {
        if(error) {
            errorCallback(error);
        }
        successCallback(JSON.parse(body));
    });
}

/**
 * Funcion para generar el duplacado de una prueba
 */
api.duplicateTest = function(req,res){
    var idTest = req.body.test || '';
    if(idTest != '' && idTest){
        automatizationDao.duplicateTest(idTest , function(err , result){
            var idNewTest = result.insertId;
            if (err) { return error.responseReturnXHR(res, {'status':501, 'returnObj':{'message':'The service is incorrect - test'}}); }
            automatizationDao.duplicateDescriptionTest(idTest , idNewTest , function(err , result){
                if (err) { return error.responseReturnXHR(res, {'status':501, 'returnObj':{'message':'The service is incorrect - description'}}); }
                //Se envia para el proceso de ejecución
                var data = {
                    project : '',
                    channel : '',
                    language : '',
                    session : '',
                    text : '',
                    headers : {},
                    code : ''
                }
                automatizationDao.searchDetailPropertyTest(idNewTest  , function(err , success){
                    if(err){
                        return error.responseReturnXHR(err, success);
                    }else{
                        data.project = success[0]['nameProject'];
                        data.channel = success[0]['nameChannel'];
                        data.language = success[0]['localeProject'];
                        automatizationDao.searchDetailTest(idNewTest , function(err , success){
                            if(err){
                                return error.responseReturnXHR(err, success);
                            }else{
                                api.recursiveSendBroker(data , success , 0 , res);
                            }
                        });
                    }
                });
            });
        });
    }else{
        return error.responseReturnXHR(res, {'status':501, 'returnObj':{'message':'The service is incorrect'}});
    }
};

/**
 * función que es llamada por api y busca todas las pruebas con flagBatch = true, las duplica y ejecuta.
 */
api.automatizationTest = function(req,res){
  console.log("llega petición ome");//BORRAR
  automatizationDao.searchTestByFlagBatch(true, function(err, rows) {
    if (err) { return error.responseReturnXHR(res, {'status':501, 'returnObj':{'message':'The service is incorrect - test', err: err}}); }
    if(rows.length > 0) {
      rows.forEach(row => {
        api.doDuplicateProcess(row.id, res);
      });
    } else {
      return error.responseReturnXHR(res, {'status':200, 'returnObj':{'message':'No existen registros para prueba automatizada.'}});
    }
  });
};


api.doDuplicateProcess = function(idTest, res) {
  console.log("duplicando registro!!", idTest);//BORRAR
  automatizationDao.duplicateTest(idTest , function(err , result){
    var idNewTest = result.insertId;
    console.log("si lo duplicó no joda!", idNewTest);//BORRAR
    if (err) { return error.responseReturnXHR(res, {'status':501, 'returnObj':{'message':'The service is incorrect - test'}}); } else {
      api.duplicateDescriptionProcess(idTest, idNewTest, res);
    }    
  });
};

api.duplicateDescriptionProcess = function(idTest, idNewTest, res) {
  automatizationDao.duplicateDescriptionTest(idTest , idNewTest , function(err , result) {
    if (err) { return error.responseReturnXHR(res, {'status':501, 'returnObj':{'message':'The service is incorrect - test'}}); } else {
      api.searchDetailPropertyTest(idTest, idNewTest, res);
    }
  });
};

api.searchDetailPropertyTest = function(idTest, idNewTest, res) {
  automatizationDao.searchDetailPropertyTest(idNewTest  , function(err , success){
    if (err) { return error.responseReturnXHR(err, success); } else {
      var data = {
        project : '',
        channel : '',
        language : '',
        session : '',
        text : '',
        headers : {},
        code : ''
      };

      data.project = success[0]['nameProject'];
      data.channel = success[0]['nameChannel'];
      data.language = success[0]['localeProject'];
      automatizationDao.searchDetailTest(idNewTest , function(err , success){
        if (err) { return error.responseReturnXHR(err, success); } else {
          api.updateAutomatizationBatch(idTest, function(err, rows) {
            if (err) { return error.responseReturnXHR(err, success); } else {
              api.recursiveSendBroker(data , success , 0 , res);
            }
          });
        }
      });
    }
  });
};

api.updateAutomatizationBatch = function(idTest, callback) {
  var flag = false;
  automatizationDao.updateFlagAutomatization(idTest , flag , function(success, err){
    callback(err, success);
  });
}

module.exports = api;
