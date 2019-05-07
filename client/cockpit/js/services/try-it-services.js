/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 


(function() {
    'use strict'
    angular
      .module('cockpitApp')
      .service('TryItServices', TryItServices);

    function TryItServices($http) {
      let url_prefix = '/cockpit/v1';
      let url_sulfix = '/tryIt/';
      let listChannel = 'listChannels/';
      let sendMessage = 'sendMessage';
      let timeout = 5000;
  
      var service = {
        getChannel: (projectId) => {
          var url = url_prefix + url_sulfix + projectId + '/' +listChannel;
          return $http({ method: 'GET', url: url});
        },
        sendMessage: ( message ) => {
          var url = url_prefix + url_sulfix + sendMessage;
          return $http({ method: 'POST', url: url , data : message , timeout : timeout});
        }
      };
      return service;
    }
  }());