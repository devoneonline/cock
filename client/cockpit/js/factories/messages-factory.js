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
        .factory('messages', messages)

        function messages($interval, $filter) {
            var template = "<div class=\"cockpit-msg :TYPE:\" id=\":ID:\"><div class=\"row\">"+
            "<div class=\"col-sm-10\">:MESSAGE:</div><div class=\"col-sm-2\" style=\"text-align: right\">"+
            "<img src=\"/cockpit/img/close.svg\" style=\"cursor:pointer\" onclick=\"closeMessage(':ID:')\" /></div></div></div>";

            var methods = {
                "msgIncr":0,
                "error":function(msg, delay) {
                    this.addMessage('danger',msg, delay);
                },
                "success":function(msg, delay) {
                    this.addMessage('success',msg, delay);
                },
                "warning":function(msg, delay) {
                    this.addMessage('warning',msg, delay);
                },
                "addMessage":function(type,msg,delay) {
                    var msgDiv = document.getElementById('generalMessages');
                    if (!msgDiv) {
                        msgDiv = document.createElement("div");
                        msgDiv.id = "generalMessages";
                        msgDiv.className = "gen-msg-area";
                        document.getElementsByTagName("body")[0].appendChild(msgDiv);
                    }
                    var id = "message-id-" + this.msgIncr++;
                    msg = $filter('translate')(msg);
                    msgDiv.innerHTML += template.replace(':TYPE:', type).replace(':MESSAGE:', msg).replace(new RegExp(':ID:', 'g'), id);
                    this.closeFn(id, delay);
                },
                "closeFn":function(id, delay) {
                    if (!delay)delay = 10000;
                    var stop = $interval(function() {
                        var elem = $('#'+id);
                        if (elem){
                            elem.addClass('fadeout');
                            $interval(function() {
                                $('#'+id).remove();
                            }, 500, 1);
                        }
                    }, delay, 1);
                }
            }
            return methods;
        }
}

) ();