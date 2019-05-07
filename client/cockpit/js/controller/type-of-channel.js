/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

var app = angular.module("cockpitApp");

app.controller('type-of-channelCtrl', function($scope, $http, cacheCleanerService, leftBar, confirmModal, messages, project, loading) {

    leftBar.show('type-of-channels');

    loading.hide();

    $scope.projects = [];
    $scope.channels = [];
    $scope.channelError = {};
    $scope.channel = {};

    $scope.channelClassifications = [
        {
            "name": "Smart Speakers & Social Robots",
            "content": [
                {
                   "name": "Amazon Echo",
                   "imageTitle": "amazon_echo",
                   "classificationId": "13"    
                },
                {
                    "name": "Google Home",
                    "imageTitle": "google_home",
                    "classificationId": "9"    
                },
                {
                    "name": "Jibo",
                    "imageTitle": "jibo",
                    "classificationId": "14"    
                }
            ]
        },
        {  
            "name": "Smart Assistants",
            "content": [
                {
                   "name": "Alexa",
                   "imageTitle": "amazon_alexa",
                   "classificationId": "7"    
                },
                {
                    "name": "Cortana",
                    "imageTitle": "cortana",
                    "classificationId": "15"    
                },
                {
                    "name": "Google Assistant",
                    "imageTitle": "assistant",
                    "classificationId": "8"    
                },
                {
                    "name": "Siri",
                    "imageTitle": "siri",
                    "classificationId": "16"    
                }
            ]
        },
        {
            "name": "Messaging Platforms",
            "content": [
                {
                   "name": "Facebook Messenger",
                   "imageTitle": "messanger",
                   "classificationId": "4"    
                },
                {
                    "name": "RCS",
                    "imageTitle": "rcs",
                    "classificationId": "17"    
                },
                {
                    "name": "SMS",
                    "imageTitle": "sms",
                    "classificationId": "18"    
                },
                {
                    "name": "Skype",
                    "imageTitle": "skype", 
                    "classificationId": "19"   
                },
                {
                    "name": "Skype for Business",
                    "imageTitle": "skype_for_busyness",
                    "classificationId": "10"    
                },
                {
                    "name": "Telegram",
                    "imageTitle": "telegram",
                    "classificationId": "20"    
                },         
                {
                    "name": "Twitter",
                    "imageTitle": "twitter",
                    "classificationId": "12"    
                },
                {
                    "name": "WhatsApp",
                    "imageTitle": "whatsapp",
                    "classificationId": "6"    
                },          
                {
                    "name": "WhatsApp (Infobip)",
                    "imageTitle": "whatsapp_infobip",
                    "classificationId": "21"    
                }
                 
            ]
        },
        {
            "name": "Synthetic Reality",
            "content": [
                {
                   "name": "ARCore",
                   "imageTitle": "arcore",  
                   "classificationId": "22"  
                },
                {
                    "name": "ARKit",
                    "imageTitle": "arkit",
                    "classificationId": "30"    
                },
                {
                    "name": "HTC Vive",
                    "imageTitle": "htc_vive",
                    "classificationId": "23"    
                },
                {
                    "name": "Oculus Rift",
                    "imageTitle": "oculos_rift",
                    "classificationId": "24"    
                },
                {
                    "name": "Oculus Go",
                    "imageTitle": "oculus_go",
                    "classificationId": "25"    
                },
                {
                    "name": "Samsung gear VR",
                    "imageTitle": "samsung_gear",
                    "classificationId": "26"    
                },
                {
                    "name": "Hololens",
                    "imageTitle": "hololens",
                    "classificationId": "27"    
                }
            ]
        },
        {
            "name": "Mobile / Tablet / Desktop",
            "content": [
                {
                   "name": "Android",
                   "imageTitle": "android", 
                   "classificationId": "28"   
                },
                {
                    "name": "IOS",
                    "imageTitle": "ios",   
                    "classificationId": "29" 
                },
                {
                    "name": "Web",
                    "imageTitle": "web",    
                    "classificationId": "1"
                },
                {
                    "name": "Web Mobile",
                    "imageTitle": "web_mobile",
                    "classificationId": "2"    
                },
                {
                    "name": "App Mobile",
                    "imageTitle": "app_mobile",
                    "classificationId": "3"    
                }
            ]
        },
        {
            "name": "Cognitive Contact Center",
            "content": [
                {
                   "name": "IVR",
                   "imageTitle": "ivr",
                   "classificationId": "5"    
                },
                {
                    "name": "VR",
                    "imageTitle": "vr",    
                    "classificationId": "11"
                }
            ]
        }
    ];

    $scope.loadChannelClassification = function() {
        $http.get('/cockpit/v1/channelClassifications').then(function(res){
            $scope.channelClassifications = res.data;
        });
    };

    var baseUri = function () {
        if (project.get() && project.get().id) {
            return "/cockpit/v1/projects/" + project.get().id + "/channels/";
        }
    }

    $scope.selectChannel = function(c){
        $scope.channelError = {};
        // c.classificationId = c.id;
        $scope.channel = angular.copy(c);
        console.log('scope.channel: ', $scope.channel);
        $('#newChannelModal').modal({"show":true});
    };

    $scope.saveNewChannel = function() {
        $scope.channelError = {};
        var c = $scope.channel;
        var ce = $scope.channelError;
        var error = false;
        
        var characterValidation = /[^\a-zA-Zá-úÁ-Úà-ùÁ-Ùê-ûÂ-Û0-9\&\(\)\-\_ ]/g; // selects everything that it's not letters, numbers, &, (), -, _
        
        if (!c.name) {
            error = true;
            ce.name = 'campo obrigatório';
        }

        if ($scope.user.groupId == '3'){
            error = true;
            messages.error("NO-PERMISSION");
        }

        if(characterValidation.test(c.name)) {
            error = true;
            ce.characterValidation = "{{'CHARACTER-VALIDATION' | translate}}"
        }

        c.projectId = project.get().id;

        if (error) return;

        $scope.savingChannel = true;
        var method = 'POST';
        var uri = baseUri();
        $http({
            "method":method,
            "url":uri,
            "headers":{
                "Content-type":"application/json"
            },
            "data":c
        }).then(
            (res) => { //SUCCESS
                messages.success("CHANNELS-ALERT-INSERT-SUCCESS",3000);
                // $scope.loadChannels();
                $('#newChannelModal').modal("hide");
                $scope.savingChannel = false;
                cacheCleanerService.clean();
				cacheCleanerService.cleanProjects();
            },
            (err) => { //ERROR
                messages.error(err.data.message ? err.data.message : JSON.stringify(err.data));
                // $scope.loadChannels();
                // $('#newChannelModal').modal("hide");
                $scope.savingChannel = false;
            }
        );
    };

    
    $scope.loadChannelClassification();
});