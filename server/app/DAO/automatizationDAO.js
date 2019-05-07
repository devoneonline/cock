/*
* eVA
* Version: 2.0
* copyright (c) 2018 everis Spain S.A
* Date: 06 February 2019
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Oscar Carantón, Aric Gutierrez.
* All rights reserved
*/ 

var sqlUtil = require('../sql-util');

var tableAutomatization = 'automatization_test';
var tableDetailAutomatization = 'automatization_test_description';
var api = {};

/**
 * verificar que el campo exista
 */
api.verifyFlag = function (callback){
    var sql = "SELECT COUNT(column_name) as 'exist' FROM information_schema.columns WHERE table_name='"+tableAutomatization+"' and column_name='flagBatch'";
    sqlUtil.executeQuery(sql, function(err, rows) {
        if (err)
			return callback(err , null);
        callback(null, rows);
    });	
}
/**
 * Actualizacion 
 */
api.updateFlagAutomatization = function( idTest , valueTest , callback){
    var sql = "UPDATE "+tableAutomatization+" SET flagBatch = "+valueTest+" WHERE id="+idTest+";";
    console.log("sql " , sql);
    sqlUtil.executeQuery(sql, function(err) {
        if (err)
			return callback(err , null);
        callback(null, null);
    });	
}

/**
 * Se crea el campo flag si no existe
 */
api.createPropertyFlag = function(callback){
    var sql = "ALTER TABLE `"+tableAutomatization+"` ADD `flagBatch` BOOLEAN NOT NULL DEFAULT FALSE AFTER `confidence`;";
    sqlUtil.executeQuery(sql, function(err, rows) {
        if (err)
			return callback(err , null);
        callback(null, rows);
    });	
}
/**
 * Funcion para la consulta de las automatizaciones por id
 */
api.selectTestAutomatization = function ( project , page, callback) {
    let sql = "SELECT au.id , au.createDate , au.name as nameTest, u.name as user ,au.confidence , au.utterances , ch.name , au.nlpVersion , au.flagBatch FROM "+tableAutomatization+" au ";
    sql = sql + " INNER JOIN cockpit_user u ON u.id = au.userId";
    sql = sql + " INNER JOIN channel ch ON ch.id = au.channelId";
    sql = sql + " WHERE au.projectId = '"+project+"'";
    sql = sql + " ORDER BY "+ "au.createDate DESC";
    sql = sql + " LIMIT "+( (page*7))+" , 7";
    sqlUtil.executeQuery2(sql, (err, result) => {
            if (err) { return callback(err); }
            api.selectPaginationTest( project, ( parseInt(page) + 1 ), result , callback );
      });
}

/**
 * Funcion para la consulta del detalle de una automatizacion por id paginado
 */
api.selectDetailAutomatization = function (id, page , filter , callback) {
    let sql = "select * from "+tableDetailAutomatization+ " where testId = "+id+" AND confidence BETWEEN 0 AND "+filter+" LIMIT "+( (page*7))+" , 7";
    console.log(sql);
      sqlUtil.executeQuery2(sql, (err, result) => {
            if (err) { return callback(err); }
            api.selectPaginationDetail( id, ( parseInt(page) + 1 ), result , callback );
      });
}

api.selectDetailAutomatization2 = function (id, page  , callback) {
    let sql = "select * from "+tableDetailAutomatization+ " where testId = "+id+"  LIMIT "+( (page*7))+" , 7";
    console.log(sql);
      sqlUtil.executeQuery2(sql, (err, result) => {
            if (err) { return callback(err); }
            api.selectPaginationDetail( id, ( parseInt(page) + 1 ), result , callback );
      });
}
/**
 * Funcion para la consulta del detalle de una automatizacion por id
 */
api.selectDetailAutomatizationNoPage = function (id , callback) {
    let sql = "select * from "+tableDetailAutomatization+ " where testId = "+id;
      sqlUtil.executeQuery2(sql, (err, result) => {
            if (err) { return callback(err); }
            callback(null, result);
      });
}
/**
 * Funcion para consulta de paginación para el detalle de la prueba
 */

api.selectPaginationTest = function (project , pageSelect , data , callback){
    let sql = "select count(*) as response from "+tableAutomatization+ " where projectId = "+project;
    sqlUtil.executeQuery2(sql, (err, result) => {
        if (err) { return callback(err); }
        let resultApi = {
            project : project,
            pageSelect : pageSelect,
            pageTotal : parseInt (result[0].response / 7) + 1,
            result : data
        }
        callback(null, resultApi);
  });
}
/**
 * Funcion para consulta de paginación para el detalle de la prueba
 */

api.selectPaginationDetail = function (idTest , pageSelect , data , callback){
    let sql = "select count(*) as response from "+tableDetailAutomatization+ " where testId = "+idTest;
    sqlUtil.executeQuery2(sql, (err, result) => {
        if (err) { return callback(err); }
        let resultApi = {
            idTest : idTest,
            pageSelect : pageSelect,
            pageTotal : parseInt (result[0].response / 7) + 1,
            result : data
        }
        callback(null, resultApi);
  });
}

/**
 * Funcion para la creacion de la prueba de automatizacion
 */
api.saveAutomatization = function (inputData, callback) {

    let title = inputData.nameTest;
    var sql = "INSERT INTO "+tableAutomatization+" (name, createDate , Utterances , userId , projectId , channelId) VALUES (";
    sql = sql + "'" + title + "' , ";
    sql = sql + " NOW() , ";
    sql = sql + inputData.detail.length +" , ";
    sql = sql + inputData.user.id +" , ";
    sql = sql + inputData.project +" , ";
    sql = sql + inputData.channel + ");";

    sqlUtil.executeQuery2(sql ,  (err , result) => {
        if (err) { return callback(err , null); }
        api.saveDetailAutomatization(result.insertId , inputData.detail , callback);
    });
}
/**
 * Funcion para la creacion del detalle de la prueba de automatizacion
 */
api.saveDetailAutomatization = function(idTest , data , callback){
    var scriptSql = "INSERT INTO "+tableDetailAutomatization+" (intent , Utterance , text , testId , data) VALUES ";
    for(var index = 0 ; index < data.length ; index++){
        scriptSql = scriptSql + "('"+data[index].INTENT+"','"+data[index].QUESTION+"' ,'"+data[index].ANSWER+"' , "+idTest+" , '"+data[index].DATA+"')";
        scriptSql = scriptSql + ((index+1 == data.length )?';':',');
    }
    sqlUtil.executeQuery2(scriptSql ,  (err , result) => {
        if (err) { return callback(err , null); }
        api.selectDetailAutomatization2(idTest , 0  , callback);
    });
}

/**
 * Funcion para la actualizacion del detalle de la prueba de automatizacion
 */
api.saveDetailUpdateAutomatization = function(idDetail , data , callback){
    var scriptSql = "UPDATE "+tableDetailAutomatization+" SET intentResult = '"+data.intent+"' , textResult='"+data.text+"' , confidence = '"+data.confidence+"' WHERE id = "+idDetail+";";
    sqlUtil.executeQuery2(scriptSql ,  (err , result) => {
        if (err) { return callback(err , null); }
        callback(null, null);
    });
}
/**
 * Funcion para la actualizacion de la prueba de automatizacion
 */
api.saveTestUpdateAutomatization = function(idTest , data , callback){
    var scriptSql = "UPDATE "+tableAutomatization+" SET confidence = '"+data.confidence+"' , sessionCode='"+data.sessionCode+"'  WHERE id = "+idTest+";";
    console.log("saveTestUpdateAutomatization", scriptSql);
    sqlUtil.executeQuery2(scriptSql ,  (err , result) => {
        if (err) { return callback(err , null); }
        callback(null, null);
    });
}
/**
 * Funcion para la consulta de los nombre para el envio a la api
 **/
api.searchDetailPropertyTest = function(idTest , callback){
    var scriptSql = "select p.name as nameProject , c.name as nameChannel, p.locale as localeProject from "+tableAutomatization+" a ";
    scriptSql = scriptSql + " INNER JOIN project p on a.projectId=p.id ";
    scriptSql = scriptSql + " INNER JOIN channel c on c.id = a.channelId";
    scriptSql = scriptSql + " WHERE a.id = '"+idTest+"'";
    console.log("searchDetailPropertyTest", scriptSql);//BORRAR
    sqlUtil.executeQuery2(scriptSql ,  (err , result) => {
        if (err) { return callback(err , null); }
        callback(null , result);
    });
}
api.updateVersionTest = function(version , idTest, callback ){
    var scriptSql = "UPDATE "+tableAutomatization+" SET nlpVersion = '"+version+"'  WHERE id = "+idTest+";";
    sqlUtil.executeQuery2(scriptSql ,  (err , result) => {
        if (err) { return callback(err , null); }
        callback(null, null);
    });
}

/**
 * Funcion para la consulta de los nombre para el envio a la api
 **/
api.searchDetailTest = function(idTest , callback){
    var scriptSql = "select * from "+tableDetailAutomatization;
    scriptSql = scriptSql + " WHERE testId = '"+idTest+"'";
    console.log("searchDetailTest", scriptSql);
    sqlUtil.executeQuery2(scriptSql ,  (err , result) => {
        if (err) { return callback(err , null); }
        callback(null , result);
    });
}

/**
 * Funcion duplicar el test en la tabla test
 **/
api.duplicateTest = function(idTest , callback){
    var scriptSql = "INSERT INTO automatization_test (name, utterances , createDate , userId , projectId , channelId , nlpVersion)";
    scriptSql = scriptSql + " SELECT name, utterances , NOW() , userId , projectId , channelId , nlpVersion";
    scriptSql = scriptSql + " FROM automatization_test WHERE id = '"+idTest+"';";

    sqlUtil.executeQuery2(scriptSql ,  (err , result) => {
        if (err) { return callback(err , null); }
        callback(null , result);
    });
}
/**
 * Funcion duplicar la descripcion de una prueba
 **/
api.duplicateDescriptionTest = function(idTest , idTestNew , callback){
    var scriptSql = "INSERT INTO automatization_test_description (intent , utterance , text , testId , data )";
    scriptSql = scriptSql + " SELECT intent , utterance , text , '"+idTestNew+"' , data ";
    scriptSql = scriptSql + " FROM automatization_test_description WHERE testId = '"+idTest+"'";
    console.log("insertando", scriptSql);//BORRAR
    sqlUtil.executeQuery2(scriptSql ,  (err , result) => {
        if (err) { return callback(err , null); }
        callback(null , result);
    });
};

/**
 * función que busca todos los registros de la tabla automatization_test en base al flagBatch (true o false)
 */
api.searchTestByFlagBatch = function(flagBatch, callback) {
  var scriptSql = "SELECT * FROM " + tableAutomatization;
    scriptSql = scriptSql + " WHERE flagBatch = " + flagBatch;
    console.log("sql", scriptSql);//BORRAR
    sqlUtil.executeQuery2(scriptSql ,  (err , result) => {
        if (err) { return callback(err , null); }
        callback(null , result);
    });
};

module.exports = api;