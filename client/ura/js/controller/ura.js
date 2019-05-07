/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
var app = angular.module("cockpitApp");
var testeGlobal = '';
app.controller('uraCtrl', function($scope, $http, $location, $filter, $interval, leftBar, confirmModal, messages, project, loading) {
    
    loading.hide();

    $scope.historyData = function() {
        $http.get("http://35.224.210.138:8080/history/" + $scope.phoneNumber + "")
            .then(function(res) {
                    $scope.dataObj = res.data;
                    for (i in $scope.dataObj) {
                        $scope.dataObj[i].userInteractions.reverse();
                    }
                },
                function(error, status) {
                    console.log(status);
                });
    };

    $scope.dataProject = function() {
        $http.get("/ura/v1/ivr/projects")
            .then(function(res) {
                $scope.dataObj = res.data;
                $scope.titleProject = $scope.dataObj[0].channelName;
                // console.log($scope.titleProject);
            }, function(error, status) {
                console.log(status);
            });
    };

    // $scope.clientData = function() {
    //     $http.get("/ura/vivo-info/" + $scope.phoneNumber + "")
    //         .then(function(res) {
    //             var data = res.data;
    //             if (data.length) {
    //                 var i = 0;
    //                 $scope.data = {
    //                     "type": data[i].type,
    //                     "description": data[i].description,
    //                     "dateStart": data[i].validFor.startDateTime,
    //                     "dateEnd": data[i].validFor.endDateTime,
    //                     "amount": data[i].remainedAmount.amount,
    //                     "consumed": data[i].remainedAmount.consumed,
    //                     "maximum": data[i].remainedAmount.maximum
    //                 }

    //                 // console.log('amount: ' + data[i].remainedAmount.amount);
    //                 // console.log('consumed: ' + data[i].remainedAmount.consumed);
    //                 // console.log('maximum: ' + data[i].remainedAmount.maximum);

    //                 // pega o tipo de plano
    //                 $scope.planType = $scope.data.type;

    //                 // Pega o consumo atual
    //                 $scope.consumo = parseFloat($scope.data.consumed) / parseFloat($scope.data.maximum);
    //                 $scope.consumo *= 100;

    //                 $scope.consumoString = $scope.getBytesSize($scope.data.amount);
    //                 $scope.maximo = $scope.getBytesSize($scope.data.maximum);
    //                 // console.log($scope.data.consumed, $scope.consumoString, $scope.data.maximum, $scope.maximo);

    //                 // Pega a data de contratação e ativação
    //                 var dateS = $scope.data.dateStart;
    //                 var dateE = $scope.data.dateEnd;
    //                 $scope.dateS = {
    //                     DDt: Date.parse(dateS)
    //                 }
    //                 $scope.dateE = {
    //                     DDt: Date.parse(dateE)
    //                 }

    //                 // Calcula dias restante para a renovação
    //                 var a = moment($scope.dateS.DDt);
    //                 var b = moment($scope.dateE.DDt);
    //                 $scope.daysDiff = b.diff(a, 'days');
    //             }
    //         }, function(error) {
    //             console.log(error);
    //         });
    // };

    $scope.getBytesSize = function(s) {
        var t = 'B';
        if (s > 1024) {
            s = s / 1024;
            t = 'KB';
        }
        if (s > 1024) {
            s = s / 1024;
            t = 'MB';
        }
        if (s > 1024) {
            s = s / 1024;
            t = 'GB';
        }
        return Math.ceil(s) + ' ' + t;
    };

    // $scope.sendMensagemBeta = function(userMessage) {
    //     var textoUsuario = userMessage.target.innerHTML;
    //     if (textoUsuario != "") {
    //         $(".scroll-everis").append("<div id='resposta-user'><p class='texto-vivi-user'><a class='icon-user'></a> <span class='texto-user'>Você</span></p> <span class='resposta-user'>" + textoUsuario + "</span> </div>");
    //         // atualizar scroll para baixo
    //         scrollToDown();
    //         //Enviar para Watson
    //         $("#texto").css('background', 'rgba(128,128,128,0.1)');
    //         $("#texto").attr('placeholder', 'Por favor Aguarde ...');
    //         $("#texto").attr('disabled', 'disabled');
    //         $("#enviar").attr('disabled', 'disabled');

    //         sendMensagemWatson(textoUsuario);
    //     } else {
    //         alert('Por favor, selecione um dos quatro grupos de atendimento do lado direito da tela.');
    //     }
    // }

    $scope.sendMensagemBeta = function (userMessage) {
        var textoUsuario = userMessage.target.innerHTML;
        if (textoUsuario != "" && testeGlobal != '') {
            $(".scroll-everis").append("<div id='resposta-user'><p class='texto-vivi-user'><a class='icon-user'></a> <span class='texto-user'>Você</span></p> <span class='resposta-user'>" + textoUsuario + "</span> </div>");
            // atualizar scroll para baixo
            scrollToDown();
            //Enviar para Watson
            $("#texto").css('background', 'rgba(128,128,128,0.1)');
            $("#texto").attr('placeholder', 'Por favor Aguarde ...');
            $("#texto").attr('disabled', 'disabled');
            $("#enviar").attr('disabled', 'disabled');
            sendMensagemWatson(textoUsuario);
        }
        else {
            alert('Por favor, selecione um dos quatro grupos de atendimento do lado direito da tela.');
        }
    }

    function sendMensagemWatson(usermessage) {
        /* Define estrutura da mensagem para ser enviada via JSON ao servidor */
        var context_Returned = "";
        var response_Returned = "";
        var dialogStack_Returned = "";
        var dialog_turn_counter_Returned = 0;
        var dialog_request_counter_Returned = 0;
        var ajaxURL = "https://broker-beta.mybluemix.net/api/conversations/" + context_Returned;
        
        // https://broker-beta.mybluemix.net/api/conversations/
        // http://35.239.134.44:8080/conversations/
        var ajaxType = "POST";
        var ajaxCrossDomain = true;
        var ajaxResponseParseMethod = "json";
        var parser = new UAParser();

        var headersAjax = {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'PROJECT': 'LATAM',
            'CHANNEL': 'WEB',
            'API-KEY': '228436ca-0017-4a34-af63-144b8d398e08',
            'OS': parser.getOS().name,
            'OS-VERSION': parser.getOS().version,
            'BROWSER': parser.getBrowser().name,
            'BROWSER-VERSION': parser.getBrowser().version,
            'LOCALE': 'pt-BR',
            'USER-REF': "35.239.134.44",
            'BUSINESS-KEY': ""
        };

        var message = {
            text: usermessage,
            returnAudio: false
        };

        /* Define AJAX Settings */
        jQuery.support.cors = true;
        var ajaxDataToTarget = message;

        // console.log(message);

        jQuery.ajax({
            headers: headersAjax,
            type: ajaxType,
            url: ajaxURL,
            crossDomain: ajaxCrossDomain,
            data: JSON.stringify(ajaxDataToTarget),
            dataType: ajaxResponseParseMethod,
            success: function(data) {
                //console.log(data.sessionCode);
                try {
                    if (data.sessionCode)
                        context_Returned = data.sessionCode;
                } catch (err) {

                }
                // console.log(data);
                answerAssistant(data);
            },
            error: function(data) {
                answerAssistantError();
                console.log(data);
            }
        })
    }

    function answerAssistantError() {
        $(".scroll-everis").append("<div><p class='texto-vivi'><a class='informacao'></a> <span class='texto-watson'>Beta</span></p><span class='resposta-vivi'>Falha na comunicação... Tente novamente</span>  </div>");
        scrollToDown();
        $("#texto").removeAttr('disabled');
        $("#enviar").removeAttr('disabled');
    }

    function answerAssistant(texto) {

        try {
            var html = "<lu style='list-style-type: none;'>";
            if (texto.answers[0].options.length != undefined) {
                for (var i = 0; i < texto.answers[0].options.length; i++) {
                    html += "<li class='margin-top5px'><a href='javascript:void(0)' id='lis-poup' data-id='" + i + "'  data-text='" + texto.answers[0].options[i].text + "'>" + texto.answers[0].options[i].title + "</a></li>";
                }
                $(".scroll-everis").append("<div><p class='texto-vivi'><a class='informacao'></a> <span class='texto-watson'>Beta</span></p><div class='resposta-vivi'>Veja a(s) resposta(s) que eu encontrei, escolha aquela que é melhor para o que você precisa ? " + html + "</lu></div></div>");
            }
            scrollToDown();
        } catch (err) {
            $(".scroll-everis").append("<div><p class='texto-vivi'><a class='informacao'></a> <span class='texto-watson'>Beta</span></p><div class='resposta-vivi'>" + texto.answers[0].text + "</div>  </div>");
            scrollToDown();
        }

        $("#texto").attr('placeholder', 'Escreva uma mensagem')
            .css('background', 'white')
            .removeAttr('disabled')
            .focus();
        $("#enviar").removeAttr('disabled');
    }

    function scrollToDown() {
        $('.scroll-everis').scrollTop($('.scroll-everis')[0].scrollHeight);
    }

    $scope.hasRedirect = function() {
        $interval(function() {
            $http.get("/ura/v1/ivr/has-redirection")
                .then(function(res) {
                    // console.log('requisição realizada com sucesso');
                    $scope.phoneNumber = res.data;
                    // console.log($scope.phoneNumber);
                    var aux = $scope.emAtendimento;
                    $scope.emAtendimento = res.data != "NONE";
                    if (!aux && $scope.emAtendimento) {
                        $scope.historyData();
                        // $scope.clientData();
                    }
                    if (!$scope.emAtendimento) {
                    	$scope.data = [];
                    }
                }, function(error, status) {
                    console.log(status);
                });
        }, 5000, 0);
    };

    // Carrosel - Histórico de Recargas
    $scope.slide = function() {
        $('.carousel').slick({
            dots: false,
            infinite: false,
            speed: 300,
            slidesToShow: 5,
            slidesToScroll: 1,
            initialSlide: 0,
            nextArrow: '<i class="fa fa-chevron-right slick-prev"></i>',
            prevArrow: '<i class="fa fa-chevron-left slick-next"></i>',
        });
        setTimeout(function() {
            $('.carousel').trigger('click');
        }, 10);
    };

    $scope.dataProject();
    $scope.hasRedirect();
    $scope.slide();






























































    $scope.chateVA = function() {
	  
        $(function () {

          function target(i) {
              return document.getElementById(i);
          }
  
          function evaChat() {
              var ip = target('chat-input');
    
          //   function evaChat() {
          // 	var ip = document.querySelector('#chat-input');
              //   var i = ip.value;
                var i = "";
                if (ip) { 
                    i = ip.value;
                    ip.value = "";
                   }
                
    
                loading(true);
                addMessage(i);
                getEVA(i);
            }
    
            function rollDown() {
                $('#scroll').animate({
                    scrollTop: $('.chat-logs').innerHeight()
                }, "slow");
            }
    
            function loading(state) {
                $('#loading').css('display', state ? 'block' : 'none');
            }
    
            function addMessage(msg, server) {
                if (server) {
                    $('#chatArea').append('<div class="server-chat"><div class="avatar">Avatar</div><div class="text">' + msg + '</div></div>');
                } else {
                    $('#chatArea').append('<div class="user-chat"><div class="text">' + msg + '</div></div>');
                }
            }
    
            var sessionCode = false;
            var context = {};
            

            function getEVA(t) {
            //   var url = "http://35.239.134.44:8080/conversations";
              var url = "http://35.224.210.138:8080/conversations";  
  
              if (sessionCode) {
                  url += "/"+sessionCode;
              }
  
              var data = {
                  text: t,
                  context: context
              };
  
              $.ajax({
                  headers:{
                      "API-KEY":"228436ca-0017-4a34-af63-144b8d398e08",
                      "PROJECT":"Everbank",
                      "CHANNEL":"WEB",
                      "LOCALE":"pt-BR",
                      "OS": navigator.platform,
                      "USER-REF":"35.224.210.138",
                      "BUSINESS-KEY":""
                  },
                  type: "POST",
                  url: url,
                  contentType: "application/json",
                  data: JSON.stringify(data),
                  dataType: 'json',
                  success: function(d) {
                      evaSuccess(d);
                  },
                  error: function () {
                      //$('#chatArea').append("Parece que estás sin internet :(");
                      addMessage("Parece que estás sin internet :(", true);
                  }
              });
          }
    
          //   function getEVA(t) {
          // 	  var url = "http://35.225.201.45:8080///conversations"; 
    
          // 	  if (sessionCode) {
          // 		  url += "/"+sessionCode;
          // 	  }
    
          // 	  var data = {
          // 		  text: t,
          // 		  context: context
          // 	  };
    
          // 	 /* headers:{
          // 		  "API-KEY":"228436ca-0017-4a34-af63-144b8d398e08",
          // 		  "PROJECT":"CIAB",
          // 		  "CHANNEL":"URA",
          // 		  "LOCALE":"pt-BR",
          // 		  "OS": navigator.platform,
          // 		  "USER-REF":"LOCALHOST",
          // 		  "BUSINESS-KEY":""
          // 		  } 
          // 		  var url = "http://35.225.201.45:8080///conversations";  */
    
          // 	  $.ajax({
          // 		  headers:{
          // 			  "API-KEY":"228436ca-0017-4a34-af63-144b8d398e08",
          // 			  "PROJECT":"CIAB",
          // 			  "CHANNEL":"URA",
          // 			  "LOCALE":"pt-BR",
          // 			  "OS": navigator.platform,
          // 			  "USER-REF":"LOCALHOST",
          // 			  "BUSINESS-KEY":""
          // 		  },
          // 		  type: "POST",
          // 		  url: url,
          // 		  contentType: "application/json",
          // 		  data: JSON.stringify(data),
          // 		  dataType: 'json',
          // 		  success: function(d) {
          // 			  evaSuccess(d);
          // 		  },
          // 		  error: function () {
          // 			  $('#chatArea').append("Parece que você está sem internet.");
    
          // 		  }
          // 	  });
          //   }
    
            function evaSuccess(data) {
                loading(false);
                addMessage(data.answers[0].text, true);
                sessionCode = data.sessionCode;
                context = data.context;
                rollDown();
            }
    
            $("#chat-submit").click(function (e) {
                var input = $("#chat-input").val();
                if (input === null || input === "") {
                    input.focus();
                    return false;
                } else {
                    rollDown();            
                    evaChat();
                }
                e.preventDefault();
            });
    
            //evaChat();
            addMessage("Olá, como posso ajudar?", true);
            loading(false);
        });
      };
      $scope.chateVA();
})