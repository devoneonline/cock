/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
(function() {
    'use strict'
    angular
        .module('cockpitApp')
        .factory('leftBar', leftBar)

        function leftBar() {
            var i;
            var j;
            
            var service = {
                "options":[
                    {
                        "textKey":"LEFT-BAR-ARCHITECTURE",
                        "img":"architecture",
                        "imgSize":27,
                        "page":"/architecture/",
                        "children":[
                            {
                                "textKey":"MENU-ANSWER",
                                "page":"answer"
                            // },{
                            // 	"textKey":"MENU-TEST",
                            // 	"page":"/architecture/test"
                            },{
                                "textKey":"MENU-CHANNEL",
                                "page":"channels"
                            }
                        ]
                    },
                    {
                        "textKey":"LEFT-BAR-DASHBOARD",
                        "img":"dashboard",
                        "imgSize":30,
                        "page":"/dashboard/",
                        "children":[
                            {
                                "textKey":"MENU-SESSIONS",
                                "page":"session"
                            },
                            {
                                "textKey":"MENU-ATTENDANCE",
                                "page":"session-table"
                            },
                            {
                                "textKey":"MENU-QUESTIONS",
                                "page":"question"
                            },
                            {
                                "textKey":"MENU-SATISFACTION",
                                "page":"satisfaction"
                            },
                            {
                                "textKey":"DOWNLOAD-MENU",
                                "page":"download-page"
                            }
                        ]
                    },
                    {
                        "textKey":"LEFT-BAR-SAMPLE",
                        "img":"sample",
                        "imgSize":30,
                        "page":"/sample/",
                        "children":[
                            {
                                "textKey":"MENU-SAMPLE-REGISTER",
                                "page":"sample-register"
                            },
                                                {
                                "textKey":"MENU-SAMPLE-SEARCH",
                                "page":"sample-search"
                            }
                        ]
                    }
                ],
                "getSelected":function() {
                    for (i in this.options) {
                        if (this.options[i].selected)
                            return this.options[i];
                    }
                },
                "showBarStatus": false,
                "hide":function() {
                    this.showBarStatus = false;
                },
                "show":function(n) {
                    if (!project.get())
                        $state.go('home');
                    this.showBarStatus = true;
                    if (n) {
                        for(i in service.options) {
                            for (j in service.options[i].children) {
                                var c = service.options[i].children[j];
                                if (c.page === n) {
                                    service.options[i].select();
                                    c.select();
                                    break;
                                }
                            }
                        }
                    }
                },
                "toggle":function() {
                    this.showBarStatus = !this.showBarStatus;
                },
                "isShow":function (){
                    return this.showBarStatus;
                }
            };
            for (i in service.options) {
                var option = service.options[i];
                option.select = function(gt) {
                    for (i in service.options) 
                        service.options[i].selected = false;
                    this.selected = true;
                    //$state.go(this.page);
                    if (this.children && this.children.length)
                        this.children[0].select(gt);
                };
                option.getImage = function() {
                    return this.img + (this.selected ? '-selected' : '');
                };
                for (j in option.children) {
                    var child = option.children[j];
                    child.parent = option;
                    child.select = function(gt) {
                        for (i in this.parent.children) 
                            this.parent.children[i].selected = false;
                        this.selected = true;
                        if (gt){
                            loading.show();
                            $state.go(this.page);
                        }
                    };
                }
            }
            return service;
        }
})();