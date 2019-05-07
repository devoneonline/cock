/*
* eVA
* Version: 2.0
* copyright (c) 2018 everis Spain S.A
* Date: 06 February 2019
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Oscar Carantón, Aric Gutierrez.
* All rights reserved
*/ 


(function(){
    'use strict'
    angular.module('cockpitApp').service('AutomatizationServices',
    [ '$http' , function ($http){
        
        let url_prefix= '/cockpit/v1';
        let url_upload = url_prefix + '/upload/excel/';
        let url_pagination = url_prefix + '/pagination/:service/:idTest/:page/';
        let url_execute = url_prefix + '/execute/test/';
        let url_duplicate = url_prefix + '/execute/duplicate/';
        let url_graphics = url_prefix + '/view/graphic/';
        let url_update_flag = url_prefix +'/update/automatization/';
        var services = {};

        services.getHistory = (data)=>{
            var response = new Promise(
                (resolve , reject) =>{
                    var dataResponse = [];

                    dataResponse.push({
                        id : '1',
                        name : 'Prueba 1',
                        createDate : '02/10/2019',
                        confidence : '66.7',
                        nplVersion : '11.1.2.121',
                        Utterance : 123 ,
                        user : {
                            name : 'admin'
                        },
                        channel : {
                            name : 'CHATBOT'
                        }
                    });
                    dataResponse.push({
                        id : '2',
                        name : 'Prueba 2',
                        createDate : '02/10/2019',
                        confidence : '66.7',
                        nplVersion : '11.1.2.121',
                        Utterance : 123 ,
                        user : {
                            name : 'admin'
                        },
                        channel : {
                            name : 'CHATBOT'
                        }
                    });
                    dataResponse.push({
                        id : '3',
                        name : 'Prueba 3',
                        createDate : '02/10/2019',
                        confidence : '66.7',
                        nplVersion : '11.1.2.121',
                        Utterance : 123 ,
                        user : {
                            name : 'admin'
                        },
                        channel : {
                            name : 'CHATBOT'
                        }
                    });
                    setTimeout(()=>{
                        resolve(dataResponse);
                    },2000);
                }
            );
            return response;
        }


        services.sendFile = (file , user , project , channel , nameTest)=>{
            
            var fd = new FormData();
            fd.append('file', file);
            fd.append('user' , (user || ''));
            fd.append('project' , (project || ''));
            fd.append('channel' , (channel || ''));
            fd.append('nameTest' , (nameTest || ''));

            return $http.post(url_upload, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        }

        services.sendPagination = (idTest , page, filter, moduleAutomatization)=>{
            filter = filter / 100;
            url_pagination = url_prefix + '/pagination/:service/:idTest/:page/:filter';
            url_pagination = url_pagination.replace(':service' , moduleAutomatization);
            url_pagination = url_pagination.replace(':idTest' , idTest);
            url_pagination = url_pagination.replace(':page' , page);
            url_pagination = url_pagination.replace(':filter' , filter);
            return $http.get(url_pagination);
        }

        services.loadChannels = (url)=>{
            return $http.get(url);
        }

        services.sendExecute = (idtest)=>{
            return $http.post(url_execute, {"test":idtest});
        }

        services.sendDuplicate = (idtest)=>{
            return $http.post(url_duplicate, {"test":idtest});
        }

        services.getGraphics = (idtest)=>{
            return $http.post(url_graphics, {"test":idtest});
        }

        services.setUpdateFlag = (idtest , flag)=>{
            return $http.post(url_update_flag, {"test":idtest , "flag" : flag});
        }

        return services;
    }])
  })();
  