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
        .factory('confirmModalPublish', confirmModalPublish)

        function confirmModalPublish() {
            var methods = {
                setBehaviour: function(fn) {
                    this.behaviour = fn;
                },
                show: function(title,textFirst, textSecond,publishedVersion, publishVersion, type, callback) {
                    if (typeof(type) == 'function') {
                        callback = type;
                        type = 'publish';
                    }
                    $('#publishModalBts').find('div').each(function(i) {
                        var e = $(this);
                        var t = e.attr('data-show-type') || e.attr('show-type');
                        e.css('display', t == type ? 'block' : 'none');
                    });
                    this.behaviour(title,textFirst,textSecond,publishedVersion,publishVersion,callback);
                },
                publish: function(title,textFirst,textSecond,publishedVersion,publishVersion,callback) {
                    service.show(title, textFirst, textSecond, publishedVersion, publishVersion, 'publish', callback);
                },
                confirm: function(title,textFirst,textSecond,publishedVersion,publishVersion,callback) {
                    service.show(title, textFirst, textSecond, publishedVersion, publishVersion,'confirm', callback);
                },
                notify: function(title,textFirst,textSecond,publishedVersion,publishVersion,callback) {
                    service.show(title, textFirst, textSecond, publishedVersion, publishVersion, 'notify', callback);
                }
            }

            return methods;
        }
}   
)();
