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
        .factory('leftBar', leftBar)

        function leftBar($state, project, loading) {
            var i;
            var j;
            var service = {
                "options": [
                    {
                      "textKey": "LEFT-BAR-ARCHITECTURE",
                      "img": "left-bar-answer",
                      "imgSize": 26,
                      "page": "/architecture/",
                      "permission": "ANSWER_MODAL",
                      "children": [
                            {
                            "textKey":"MENU-ANSWER",
                            "page":"answer"
                            },{
                            "textKey":"MENU-FLOW",
                            "page":"flow"
                            }
                        ]
                    },{
                    //     "textKey": "LEFT-BAR-INTENT",
                    //     "img": "left-bar-intention",
                    //     "imgSize": 26,
                    //     "page": "intent",
                    //     "permission": "INTENT_MODAL",
                    //     "children": [
                    //         {
                    //             "textKey":"MENU-INTENT",
                    //             "page":"intent"
                    //         },
                    //         {
                    //             "textKey":"MENU-ENTITY",
                    //             "page":"entity"
                    //         },
                    //         {
                    //             "textKey":"MENU-TRAIN-PUB",
                    //             "page":"train-pub"
                    //         }
                    //     ]
                    //  },{
                        "textKey": "LEFT-BAR-DASHBOARD",
                        "img": "left-bar-dashboard",
                        "imgSize": 26,
                        "page": "dashboard",
                        "permission": "DASHBOARD_MODAL",
                        "children": [
                            {
                                "textKey":"MENU-ATTENDANCE",
                                "page":"session-table"
                            },{
                                "textKey":"MENU-SESSIONS",
                                "page":"session"
                            },{
                                "textKey":"MENU-QUESTIONS",
                                "page":"question"
                            },{
                                "textKey":"MENU-SATISFACTION",
                                "page":"satisfaction"
                            }
                        ]
                    },{
                        "textKey": "LEFT-BAR-CHANNELS",
                        "img": "left-bar-channels",
                        "imgSize": 26,
                        "page": "channels",
                        "permission": "SEARCH_CHANNEL",
                        "children": [
                            {
                                "textKey":"MENU-MY-CHANNELS",
                                "page":"your-channel"

                            },{
                                "textKey":"MENU-CREATE-CHANNEL",
                                "page":"type-of-channels"
                            }
                        ]
                    }
                    //AUTOMATIZATION - MODULE
                    ,{
                        "textKey": "LEFT-BAR-AUTOMATIZATION.TITLE-MENU",
                        "img": "left-bar-automatization",
                        "imgSize": 26,
                        "page": "automatization-execute",
                        "permission": "SEARCH_CHANNEL",
                        "children": [
                            {
                                "textKey":"LEFT-BAR-AUTOMATIZATION.TITLE-HISTORY",
                                "page":"automatization-history"

                            },{
                                "textKey":"LEFT-BAR-AUTOMATIZATION.TITLE-EXECUTE",
                                "page":"automatization-execute"
                            },{
                                "textKey":"LEFT-BAR-AUTOMATIZATION.TITLE-DOWNLOAD-EXCEL",
                                "page":"download-excel-test-automatization"
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
                    if (!project.get()) {
                        $state.go('home');
                    }
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
                    for (i in service.options) {
                        service.options[i].selected = false;
                    }
                    this.selected = true;
                    if (this.children && this.children.length) {
                        this.children[0].select(gt);
                    }
                };
                option.getImage = function() {
                    return this.img + (this.selected ? '-selected' : '');
                };
                for (j in option.children) {
                    var child = option.children[j];
                    child.parent = option;
                    child.select = function(gt) {
                        for (i in this.parent.children) {
                            this.parent.children[i].selected = false;
                        }
                        this.selected = true;
                        if (gt) {
                            loading.show();
                            $state.go(this.page);
                        }
                    };
                }
            }

            return service;
        }
        
}

)();
