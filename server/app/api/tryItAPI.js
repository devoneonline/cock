/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
'use strict';

const tryNowDAO = require('../DAO/tryNowDAO');
const error = require('../error/error');
let Request = require("request");
const HOST_BROKER = "http://35.232.139.108:8080/"; 
const ENDPOINT_BROKER = HOST_BROKER + "conversations/";
var api = {};

// Metodo de conexion al broker 


api.listChannels = (req, res) => {
    var idProject = req.params['idProject'];
    let channelsOut = []
    tryNowDAO.listChannels(idProject , (err, channels) => {
		if (err) {
			return err.responseReturnXHR(res, err);
        }
        console.log("Encontrados "+channels.length+" canales");
        if(channels.length > 0){
            let idGroup = [];
            for(var index = 0 ; index < channels.length ; index ++){
                idGroup.push(channels[index].classificationId)
            }
            tryNowDAO.listCategoryChannels(idGroup , (err, category)=>{
                if (err) {
                    return err.responseReturnXHR(res, err);
                }
                for(var index = 0 ; index < category.length ; index ++){
                    var tmp = [];
                    for(var aux = 0 ; aux < channels.length ; aux++){
                        if(channels[aux].classificationId === category[index].id){
                            tmp.push({
                                id: channels[aux].id,
                                title :channels[aux].name ,
                                systemName : channels[aux].systemName ,
                                description : channels[aux].description,
                                category : channels[aux].classificationId
                            });
                        }
                    }
                    channelsOut.push({
                        id : category[index].id,
                        title : category[index].name,
                        buttons : tmp 
                    });
                }
                return error.responseReturnXHR(res, err, channelsOut);
            });
        }else{
            return error.responseReturnXHR(res, err, channelsOut);
        }
    });
}

api.sendMessage = (req, res) =>{
    var contentData = req.body;
    console.log("message ", contentData);
    let endpoint = (contentData.session)?ENDPOINT_BROKER +'/'+contentData.session : ENDPOINT_BROKER;
    var ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'none';
    console.log("Consultado desde ", ip);
    Request.post({
        "headers": {
            "API-KEY": (contentData.key || "keykey"),
            "CHANNEL": contentData.channel,
            "Content-Type": "application/json",
            "LOCALE": contentData.locale,
            "OS": (contentData.os || 'UNIX'),
            "PROJECT": contentData.project,
            "USER-REF" :ip, 
            "User-Agent": contentData.agente
        },
        "url": endpoint ,
        "body": JSON.stringify({
            "context": {},
            "text": contentData.message
        })
    }, (err, response, body) => {
        if(err) {
            return console.log("error" , err);
        }
        console.log("body" ,body );
        return error.responseReturnXHR(res, err, body);
    });
}



module.exports = api;