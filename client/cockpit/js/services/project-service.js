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
    .service('ProjectService', ProjectService);
  function ProjectService($http) {
    let url_prefix = '/cockpit/v1';
    let url_sulfix = '/projects/';
    let url_sulfix_u = '/projectsuser/';

    var service = {
      getProjectUser: (userid) => {
        var url = url_prefix + url_sulfix_u + userid;
        return $http({ method: 'GET', url: url});
      },
      load: () => {
        var url = url_prefix + url_sulfix;
        return $http({ method: 'GET', url: url});
      },
      delete: (project) => {
        var url = url_prefix + url_sulfix + project;
        return $http({ method: 'DELETE', url: url});
      }
    };
    return service;
  }
}());
