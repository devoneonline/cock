/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

(function() {
    'use strict';
    var cockpit = angular.module('cockpitApp');
    cockpit.directive('tryNow', [function() {
            return {
                templateUrl: 'pages/directives/directive-try-now.html',
                restrict: 'E',
                controller: ['$scope' , 'TryFactory','$anchorScroll', '$location', 
                 function ($scope , TryFactory , $anchorScroll , $location){
                    $scope.status = "";
                    /**
                     *
                     * INICIO DE LA LOGICA DEL POPUP DE TRY NOW 
                     * Aric Gutierrez
                     * Everis Colombia
                     * 
                     **/
                    // Apertura del POP UP
                    $scope.showWindowTest = ()=>{
                        $scope.status = ($scope.status == 'animate-chat') ? 'visible animate-chat' : 'animate-chat';
                    }
                    
                    /**
                     *
                     * FIN DE LA LOGICA DEL POPUP DE TRY NOW 
                     * Aric Gutierrez
                     * Everis Colombia
                     * 
                     **/


                    $scope.loading = false;
                    $anchorScroll.yOffset = 50;
                    $scope.searchResponse = false;
                    var session;
                    $scope.noAssist = false;
                    var listChannel = [];
                    $scope.init = ()=>{
                        $scope.status = "animate-chat";
                        $scope.loading = true;
                        TryFactory.searchChannel().then(
                            (success)=>{
                                $scope.noAssist = false;
                                $scope.loading = false;
                                listChannel = success;
                                $scope.listChannel = listChannel;
                            },(error)=>{
                                $scope.noAssist = true;
                                $scope.loading = false;
                                $scope.listChannel = [];
                                listChannel = [];
                            }
                        );
                    }

                    $scope.selectChannel = (channel)=>{
                        $scope.searchResponse = true;
                        $scope.type = channel.title;
                        let sendInfo = {
                            "message" : "oi",
                            "channel": $scope.type
                        }
                        TryFactory.sendTest(sendInfo).then(
                            (success)=>{
                                if(!success.hasOwnProperty('answers')){
                                    $scope.noAssist = true;
                                    $scope.searchResponse = false;
                                    return;
                                }
                                $scope.noAssist = false;
                                $scope.searchResponse = false;
                                session = success.sessionCode;
                                $scope.listMessage = [
                                    {
                                      id : "1",
                                      type : "received",
                                      text : (success.answers[0].options)?success.answers[0].options:success.answers[0].text,
                                      id : ""
                                    }
                                  ];
                            },(error)=>{
                                $scope.noAssist = true;
                                $scope.searchResponse = false;
                                console.error("Error send ", error);
                            }
                        );
                      }

                      
                      $scope.changeChannel = (channel)=>{
                        $scope.type = '';
                        session = undefined;
                        $scope.listMessage = [];
                      }

                      $scope.sendMessage = (message)=>{
                        if(message == '' || message == undefined || message == null){
                            return;
                        }
                        $scope.searchResponse = true;
                        if ($location.hash() !== 9999999) {
                            $location.hash(9999999);
                        } else {
                            $anchorScroll();
                        }
                        var sms = message;
                        $scope.listMessage.push({
                            id : ($scope.listMessage.length + 1) ,
                            type : "send",
                            text : sms
                        });

                        let sendInfo = {
                            "message" : sms,
                            "channel": $scope.type,
                            "session" : session
                        }
                        TryFactory.sendTest(sendInfo).then(
                            (success)=>{
                                $scope.searchResponse = false;
                                if(!success.hasOwnProperty('answers')){
                                    $scope.noAssist = true;
                                }else{
                                    $scope.noAssist = false;
                                    $scope.message = '';
                                    message = '';
                                    document.getElementById('input_send_message').value = ''
                                    var idRandom = Math.floor(Math.random() * (+999999 - +100000)) + +100000; 
                                    $scope.listMessage.push({
                                        id : idRandom,
                                        type : "received",
                                        text : (success.answers[0].options)?success.answers[0].options:success.answers[0].text
                                        });
                                    if ($location.hash() !== idRandom) {
                                        $location.hash(idRandom);
                                    } else {
                                        $anchorScroll();
                                    }
                                }
                            },(error)=>{  
                                $scope.noAssist = true;  
                                $scope.searchResponse = false;
                            }
                        );
                      }
                    
                      $scope.downScrollContent = ()=>{
                        var objDiv = document.getElementById("content_test_try_now");
                        objDiv.scrollTop = (objDiv.scrollHeight );
                      }
                    
                      $scope.sendMessageKey = (keyEvent ,message)=>{
                        if (keyEvent.which === 13){
                          $scope.sendMessage(message);
                        }
                      }
                    
                      $scope.filterContent = (filterInput)=>{
                        if (filterInput && filterInput.trim() != '') {
                          $scope.listChannel = [];
                          for(var aux = 0 ; aux < listChannel.length ; aux++){
                            var chanel = {
                              title : listChannel[aux].title,
                              buttons : []
                            }
                            chanel.buttons = listChannel[aux].buttons.filter((item) => {
                              return (item.title.toLowerCase().indexOf(filterInput.toLowerCase()) > -1);
                            });
                            if(chanel.buttons.length > 0){
                                $scope.listChannel.push(chanel);
                            }
                          }
                        }else{
                            $scope.listChannel = listChannel;
                        }
                      }

                      $scope.sendFocus = (flag)=>{
                        var objDiv = document.getElementById("iconFly");
                        let img = 'send';
                        if(flag){
                            img = 'send_focus';
                        }
                        objDiv.style.background = ' url(img/'+img+'.svg) no-repeat';
                        objDiv.style.backgroundSize = 'contain';
                      }
                    
                      $scope.listChannel = [];
                      $scope.listMessage = [];
                      $scope.type = '';
                      $scope.message = '';
                }]
            }
        }])
})()