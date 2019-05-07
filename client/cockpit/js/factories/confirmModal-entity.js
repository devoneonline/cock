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
        .factory('confirmModalEntity', confirmModalEntity)

        function confirmModalEntity() {
            var methods = {
                setBehaviours: function(fn) {
                    this.behaviours = fn;
                },
                show: function(title,text,type,callback) {
                    if (typeof(type) == 'function') {
                        callback = type;
                        type = 'remove';
                    }
                    $('#confirmModalBts').find('div').each(function(i) {
                        var e = $(this);
                        var t = e.attr('data-show-type') || e.attr('show-type');
                        e.css('display', t == type ? 'block' : 'none');
                    });
                    this.behaviours(title,text,callback);
                },
                remove: function(title,text,callback) {
                    service.show(title, text, 'remove', callback);
                },
                confirm: function(title,text,callback) {
                    service.show(title, text, 'confirm', callback);
                },
                notify: function(title,text,callback) {
                    service.show(title, text, 'notify', callback);
                }
            }

            return methods;
        }
}
)();