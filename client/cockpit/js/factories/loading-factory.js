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
        .factory('loading', loading);

        function loading() {
            var methods = {
                "setLoadingFn":function(fn) {
                    this.loadingFn = fn;
                },
                "show":function() {
                    this.loadingFn(true);
                },
                "hide":function() {
                    this.loadingFn(false);
                }
            }
            return methods;
        }
}
)();