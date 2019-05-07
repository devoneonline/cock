/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

var app = angular.module("cockpitApp");

app.controller('session-tableCtrl', function($scope, $http, project, messages, leftBar, loading, confirmModal, userInfo){

    $scope.userInfo = userInfo.get();
    leftBar.show('session-table');

    var uri = '/cockpit/v1/projects/' + project.get().id +  '/session/export' + '?userName='+$scope.user.name+'&userEmail='+$scope.user.email;
    var sessionData = {};

    var maxDayLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();

    if(new Date().getDate() - 7 < 0){
        var daysRemaining = (new Date().getDate() - 7) * (-1);
        maxDayLastMonth -= daysRemaining;
        if(new Date().getMonth() == 0)
            $scope.startDate = maxDayLastMonth + '/12'  + '/' + (new Date().getFullYear() - 1);
        else
            $scope.startDate = maxDayLastMonth + '/' + (new Date().getMonth()) + '/' + new Date().getFullYear();
    }else{
        var day = new Date().getDate() - 7;
        if (new Date().getDate() - 7 == 0) day = 1;
        $scope.startDate = (day) + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear();
    }
    
    $scope.endDate = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear();
    $scope.date = $scope.startDate + ' - ' + $scope.endDate;
    $scope.sessions = [];
    $scope.channels = [];
    $scope.answerStatus = [];
    $scope.page = 1;
    $scope.message = false;
    $scope.loadingTable = true;

    $scope.filter = function(){
        $scope.message = false;
        var first = true;
        $scope.loadingTable = true;
        uri = '/cockpit/v1/projects/' + project.get().id +  '/session/export';

        if($scope.outputChannels){
            var channels = [];
            var channelName = [];
            for(i in $scope.outputChannels){
                channels.push($scope.outputChannels[i].id);
                channelName.push($scope.outputChannels[i].name);
            }
            if(channels.length > 0){
                sessionData.channelId = channels;
                uri += '?channelId=['+ channels.toString() + ']' + '&channelName=['+ channelName.toString() +']';
                first = false;
            }else{
                sessionData.channelId = '';
            }
        }

        if($scope.date){
            var fullDate = $scope.date;
            var splitDate = fullDate.split(" - ");
            sessionData.createDateIni = splitDate[0].split('/').reverse().join('/');
            sessionData.createDateEnd = splitDate[1].split('/').reverse().join('/');

            $scope.createDateIni = splitDate[0].split('/').reverse().join('-');
            $scope.createDateEnd = splitDate[1].split('/').reverse().join('-');
            uri += (first ? '?' : '&')+'createDateIni='+$scope.createDateIni+'&createDateEnd='+$scope.createDateEnd;
            first = false;
        }

        if($scope.outputStatus){
            var status = [];
            var statusName = [];
            for(i in $scope.outputStatus){
                status.push($scope.outputStatus[i].id);
                statusName.push($scope.outputStatus[i].name);
            }
            if(status.length > 0){
                sessionData.status = status;
                uri += (first ? '?' : '&')+'status=['+ status.toString() + ']' + '&statusName=['+ statusName.toString()  +']';
                first = false;
            }else{
                sessionData.status = '';
            }
        }

        if($scope.showSessionFilter){
            sessionData.sessionCode = $scope.sessionCode;
            uri += (first ? '?' : '&')+'sessionCode='+$scope.sessionCode;
        }else{
            sessionData.sessionCode = '';
        }

        uri+=$scope.userInfoUri = '&userName='+$scope.user.name+'&userEmail='+$scope.user.email;
        
        $scope.page = 1;
        $scope.loadSessionTable(true);
        $('.get-more-sessions').css('display', 'block');
    }

  
        $scope.loadChannel = function(){
            $http.get('/cockpit/v1/projects/' + project.get().id +  '/channels').then(
                function(res){
                    for(i in res.data){
                        res.data[i].name;
                        $scope.channels.push({name: res.data[i].name, id: res.data[i].id});
                    }
                },
                //ERROR
                function(err) {
                    console.log(err.data);
                    messages.error('ANSWER-LOAD-STATUS-ERROR');
                }
            );
        }
  

   
        $scope.loadAnswerStatus = function() {
            $http.get('/cockpit/v1/answers/status').then(
                //SUCCESS
                function(res) {
                    $scope.answerStatus = res.data;
                    loading.hide();
                },
                //ERROR
                function(err) {
                    console.log(err.data);
                    messages.error('ANSWER-LOAD-STATUS-ERROR');
                }
            );
        }
  

    $scope.loadSessionTable = function(filter){
        sessionData.page = $scope.page++;

        $('#filterBtn').css('cursor','wait');
        $scope.loading = true;
        $http.post('/cockpit/v1/projects/' + project.get().id +  '/session/search', sessionData).then(
            //SUCCESS
            function(res){
                if(filter){
                    $scope.sessions = res.data.sessions;
                    var len = $scope.sessions.length;

                    if($scope.sessions.length == 0){
                        $scope.message = true;
                        $('.get-more-sessions').css('display', 'none');
                    }else{
                        $scope.message = false;
                        if($scope.sessions.length < 20)
                            $('.get-more-sessions').css('display', 'none');
                        else
                            $('.get-more-sessions').css('display', 'block');
                    }

                }else{

                    var len = $scope.sessions.length;
                    for(i in res.data.sessions){
                        $scope.sessions.push(res.data.sessions[i]);
                    }
                    if(len == $scope.sessions.length)
                        $('.get-more-sessions').css('display', 'none');
                }
                $scope.sessionsQty = res.data.count;
                $scope.loading = false;
                $scope.loadingTable = false;
                $('#filterBtn').css('cursor','pointer');
                console.log($scope.loading);
            },
            //ERROR
            function(err){
                $scope.loading = false;
		$('#filterBtn').css('cursor','pointer');
                console.log(err)
                messages.error('Muitos dados a carregar. Por favor selecione um range de data menor e um filtro de canal.');
            }
        )
    }

    //User info
    $http.get('/cockpit/v1/user').then(function(res){
        $scope.user = res.data;
    });

    $scope.exportSessions = function(){
        confirmModal.show('DOWNLOAD-EXCEL','A busca retornou ' + $scope.sessionsQty + ' linhas. Deseja baixar mesmo assim?','confirm', function(){
            $http.get(uri).then(
                function(res){
                    messages.success(res.data, 6000);
                },
                function(err){
                    messages.error('ANSWER-LOAD-STATUS-ERROR');
                }
            )
        });
    }

    $scope.$watch("showSessionFilter", function(){
        if($scope.showSessionFilter){
            // $('#selectNoneButton').click();
            // console.log($scope.showSessionFilter);
        }else{
            $("#sessionCodeInput").val("");
            $scope.sessionCode = '';
        }
    });

    $('input[name="daterange"]').daterangepicker({
        locale:{
            format: 'DD/MM/YYYY',
            "separator": " - ",
            "applyLabel": "Aplicar",
            "cancelLabel": "Cancelar",
            "fromLabel": "De",
            "toLabel": "Até",
            "customRangeLabel": "Custom",
            "daysOfWeek": [
                "Dom",
                "Seg",
                "Ter",
                "Qua",
                "Qui",
                "Sex",
                "Sab"
            ],
            "monthNames": [
                "Janeiro",
                "Fevereiro",
                "Março",
                "Abril",
                "Maio",
                "Junho",
                "Julho",
                "Agosto",
                "Setembro",
                "Outubro",
                "Novembro",
                "Dezembro"
            ]
        },
        buttonClasses: 'btns',
        startDate: $scope.startDate,
        endDate: $scope.endDate,
    });
    $('button').removeClass("btn-default btn-success");
    $('.cancelBtn').before('<br><br>');
    $('.calendarie-icon').click(function(){
        $('.date-filter').click();
    });

    //$scope.loadSessionTable();
    if($scope.userInfo.groupId!=3) {$scope.loadChannel()}
    if($scope.userInfo.groupId!=3) {$scope.loadAnswerStatus()}
});