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
    angular.module('cockpitApp').factory('AutomatizationHistoryFactory', 
        ['AutomatizationServices' , 'project', function ( AutomatizationServices , project){
            var methods = {};
            var MODULE_ACTIVE = 'test';


            methods.sendPagination = (page) =>{
                let idProject = project.get().id;
                return AutomatizationServices.sendPagination(idProject , page , 0 , MODULE_ACTIVE);
            }

            methods.setUpdateFlag = (idTest , valueFlag)=>{
                return AutomatizationServices.setUpdateFlag(idTest , valueFlag);
            }

            return methods;
        }
])})();