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
    .service('AnswersService', AnswersService);
  function AnswersService($http) {
    let url_prefix = '/cockpit/v1';
    let url_sulfix_a = '/answers/';
    let url_sulfix_p = '/projects/';

    var service = {
      delete: function(locate, code, project) {
        var url = url_prefix + url_sulfix_a + locate + '/' + code + url_sulfix_p + project;
        return $http({ method: 'DELETE', url: url});
      },
      getStatus: () => {
        var url = url_prefix + url_sulfix_a + 'status';
        return $http({ method: 'GET', url: url});
      },
      getChannels: (project) => {
        var url = url_prefix + url_sulfix_p + project + '/channels';
        return $http({ method: 'GET', url: url});
      }
    };
    return service;
  }
}());
