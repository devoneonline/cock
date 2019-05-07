/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

var app = angular.module('cockpitApp');

app.controller('train-pubCtrl', function($scope, $rootScope, project, leftBar, loading, messages, TrainingService, confirmModalPublish, userInfo) {
    leftBar.show('train-pub');
    loading.hide();

    var user = userInfo.get().name;
    $scope.allTrainings = [];
    $scope.trainingList = [];
    var latestTraining;
    var lastTrainingDate;
    $scope.pages = 0;
    var itemsPerPage = 7;
    $scope.blockPagination = false;
    $scope.trainingsQtd;
    $scope.isEnable = false;
    $scope.newVersion;
    $scope.latestTraining;
    $scope.isTraining = false;
    trainingProgress = 0;
    $scope.trainingProgress = trainingProgress;
    $scope.training;
    $scope.published;
    $scope.fadeOut = false; //manage the fade out of the training bar


    function onTraining(){ //check if there is training going on
        if(project.get()) {
            var nlpId = project.get().nlpEngineId;
            TrainingService.onTraining(nlpId)
            .then(
                function(res){
                    $scope.training = res['data'][0];
                    if(res.length>0 || res['data'][0].status == "processing"){
                        $scope.fadeOut = false;
                        $scope.isTraining = !$scope.isTraining;
                        angular.element('.progress-bar-train').css('width', $scope.trainingProgress);
                        if (res['data'].length == 0) {
                            latestTraining = 0;
                        } else {
                            latestTraining = res['data'][0].version;
                        }
                        $scope.latestTraining = latestTraining;
                     }
                },
                function(err) {
                    console.log('erro: ', err);
                    messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
                },
            )
        }
    }
    
    function getLastTraining () { //receive this bot's last training
        if(project.get()) {
            var nlpId = project.get().nlpEngineId;
            TrainingService.getLastTraining(nlpId)
                .then(
                    function(res) {
                        if( res['data'][0].status != "processing"){
                               if (res['data'].length == 0) {
                                latestTraining = 0;
                            } else {
                                latestTraining = parseInt(res['data'][0].version) + 1;
                            }
                            $scope.latestTraining = latestTraining;
                        }
                    },
                    function(err) {
                        console.log('erro: ', err);
                        messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
                    }
                )
        }
    }

    $scope.listTrainings = function(page) { //list trainings per page
        $scope.currentPage = page;
        if(!page) page = 1;
        if(project.get()) {
            var nlpId = project.get().nlpEngineId;
            TrainingService.load(nlpId, page, $scope.isEnable)
                .then(
                    function(res) {
                        formatDate(res['data']);
                    },
                    function(err) {
                        console.log('erro: ', err);
                        messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
                    }
                ).then(
                    function(res) {
                        if($scope.trainingList[0] != undefined) {
                            lastTrainingDate = $scope.trainingList[0].createDate;
                            $scope.latestTraining = latestTraining;
                        } else {
                            $scope.latestTraining = 0;
                        }
                    }
                )
        }
    }

    function countTrainings() { //count the number of trainings for pagination
        if(project.get()) {
            var nlpId = project.get().nlpEngineId;
            TrainingService.count(nlpId, $scope.isEnable)
                .then(
                    function(res) {
                        $scope.trainingsQtd = res['data'];
                        if(($scope.trainingsQtd/itemsPerPage) > 1) 
                            $scope.pages = Math.ceil($scope.trainingsQtd/itemsPerPage);
                    },
                    function(err) {
                        console.log('erro: ', err);
                        messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
                    }
                )
        }
    }

    $scope.listChanged = function(page) {
        $scope.blockPagination = true;
        var arr = [];
        for (var i = (page-1) * 3; i < (page-1) * 3 + 3; i++){
            arr.push($scope.trainingList[i]);
        }
        $scope.trainingList = arr;
        {$scope.blockPagination = false;}
    }
 
    $scope.selectLastVersion = function(v) { //manage new training version
        if(v.version == ''){
            v = 0;
        } else {
            v.version = v.version +1;
        }
    }

    function newIntents(){ //checks if there is a new version for training
        if(project.get()) {
            var nlpId = project.get().nlpEngineId;
            TrainingService.searchTraining(nlpId)
            .then(
                function(res){
                    $scope.fadeOut = false;
                    $scope.newVersion = res['data'];
                },
                function(err) {
                    console.log('erro: ', err);
                    messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
                },
            )
        }
    }
    
    $scope.startTraining = function() { //start training in Clever
        if(project.get()) {
            var nlpId = project.get().nlpEngineId;
            var projectName = project.get().name;
            var locale = project.get().locale;
            TrainingService.startTraining(nlpId, projectName, locale, $scope.latestTraining)
                .then(
                    function(res) {
                        
                        $scope.training = res['data'];
                        $scope.isTraining = !$scope.isTraining;
                        angular.element('.progress-bar-train').css('width', $scope.trainingProgress);
                        
                    },
                    function(err) {
                        console.log('erro: ', err);
                        messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
                    }
                )
        }

    }


    $scope.publishTraining = function(training) {//publish training in Clever
        var nlpId = project.get().nlpEngineId;
        TrainingService.searchPublishedTraining(nlpId)
            .then(
                function(res){
                    var firstTrain = true;
                    $scope.publishedVersion = res['data'][0].version;
                    $scope.publishVersion = training.version;
                    confirmModalPublish.show('PUBLISH-TRAINING-LABEL', 'DESCRIPTION-UNPUBLISHED-TRAINING','DESCRIPTION-PUBLISH-TRAINING', $scope.publishedVersion, $scope.publishVersion, function(){
                        if(project.get()) {
                            var uuid = training.uuid;
                            var projectName = project.get().name;
                            var locale = project.get().locale;
                            var version = training.version;
                            TrainingService.publishTraining(nlpId, version, uuid, projectName, locale, firstTrain)
                                .then(
                                    function(res) {
                                        // $scope.training = res['data'].published;
                                        $scope.listTrainings($scope.currentPage);
                                    },
                                    function(err) {
                                        console.log('erro: ', err);
                                        messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
                                    }
                                )
                        }
                    })
                },
                function(err) {
                    console.log('erro: ', err);
                    messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
                },
            )

    }

    function formatDate(obj) { //formate date for the training list
        $scope.trainingList = [];
        obj.forEach(function(element, index){
            var date = element.createDate;
            var splitDate = date.split(/(?=[A-Z])/);
            var splitYear = splitDate[0].split('-'),
                fullYear = [splitYear[2], splitYear[1], splitYear[0]].join('/');
            var splitTime = splitDate[1].split(/[^0-9]/)
                fullTime = [splitTime[1], splitTime[2], splitTime[3]].join(':');
            var trainingTime = fullYear + ' ' + fullTime;
                element.trainingTime = trainingTime;

                $scope.trainingList[index] = element;
        });
    }

    $scope.openOtions = function(opt) {
        $scope.selectedTraining = opt;
        $scope.selectedTraining.isToggled = !$scope.selectedTraining.isToggled;
    }


    onTraining();
    getLastTraining();
    $scope.listTrainings();
    countTrainings();
    newIntents();
    


 
    
    

    //// TOGGLE SWITCH ////

    $scope.toggleSwitch = function() {
        $scope.isEnable = !$scope.isEnable;
        // $scope.isEnable ? $scope.listTrainings() : $scope.listTrainings($scope.currentPage);
        $scope.listTrainings(1);
        $scope.currentPage = 1;
        countTrainings();

        // countTrainings()
    }

    ////////////////////////


    //// PAGINATION ////

    $scope.viewby = 5;
    $scope.totalItems = $scope.trainingList.length;
    $scope.currentPage = 1;
    $scope.itemsPerPage = $scope.viewby;
    $scope.maxSize = 5; //Number of pager buttons to show

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        console.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.setItemsPerPage = function(num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first page
    }

    /////////////////////

    ///////////////////// WEBSOCKET //////////////////

    var wscon;

    var fullUrl = window.location.href;
    var arr = fullUrl.split('/');
    var url = "ws://" + arr[2];

    function connect() { //manage websocket connection

        if (wscon && wscon.readyState === wscon.OPEN) {
            console.log('connection is already oppened');
        } else {
            wscon = new WebSocket(url, "clever-protocol");
            wscon.onerror = onError;
            wscon.onopen = onOpen;
            wscon.onclose = onClose;
            wscon.onmessage = onMessage;
        }
    }

    function disconnect(){
        wscon.close();
    }

    //Callbacks
    function onError(){
        console.log('Connection error');
    }
    
    function onOpen() {
        console.log('WS connected');
        function sendNumber() {
            if (wscon.readyState === wscon.OPEN) {
                wscon.send($scope.training.uuid);
            }
        }
        sendNumber();
    };
    
    function onClose() {
        console.log('echo-protocol Client Closed');
    };

    function onMessage(e) { //receives message from server
        if (typeof e.data === 'string') {
            applyChanges(e.data)
        }
    };
    
    function applyChanges(msg){ //parse server message and apply it to the progress bar
        var content = JSON.parse(msg);
        progress = Math.round(content.results.training_perc * 100);
        var percentage = progress + '%';
        $rootScope.$broadcast('trainingProgress', progress);
        angular.element('.progress-bar-train').css('width', percentage);
        if(content.status != 'processing' && content.status != 'received') { //disconnect from websocket when training is completed
            var nlpId = project.get().nlpEngineId;
            var accuracy = content.results.model_accuracy == undefined ? 0 : content.results.model_accuracy;
            TrainingService.finishTraining(nlpId, $scope.training.uuid, content.status, accuracy, user)
                .then(
                    function(result) {
                        $scope.listTrainings($scope.currentPage);
                         
                        $scope.newVersion = false;
                        $scope.isTraining = false;
                        $scope.fadeOut = true;
                        
                        disconnect();
                        

                        var nlpId = project.get().nlpEngineId;
                        TrainingService.searchPublishedTraining(nlpId)
                            .then(
                                function (res) {
                                    var version = $scope.training.result.parameters.version;
                                    var uuid = $scope.training.result.parameters.uuid;
                                    var projectName = project.get().name;
                                    var locale = project.get().locale;
                                   
                               
                                    
                                    if (res.data.length == 0){
                                        
                                        TrainingService.publishTraining(nlpId, version, uuid, projectName, locale, false)
                                            .then(
                                                function (res) {
                                                    // $scope.training = res['data'].published;
                                                    $scope.listTrainings($scope.currentPage);
                                                },
                                                function (err) {
                                                    console.log('erro: ', err);
                                                    messages.error(err['data'] ? (err.data['message'] ? err.data['message'] : JSON.stringify(err.data)) : JSON.stringify(err));
                                                }
                                            )


                                    }
                                    
                                },
                                function (err) {
                                    console.log('erro: ', err);
                                    messages.error(err['data'] ? (err.data['message'] ? err.data['message'] : JSON.stringify(err.data)) : JSON.stringify(err));
                                },
                            )

                    },
                    function(error) {
                        console.log(error);
                    }
                )
        }

    }

    connect();

    $scope.$on('trainingProgress', function(events, args) { //applies $scope changes to the controller
        $scope.$apply(function() {
            $scope.trainingProgress = args + '%';
        })
    })

    $scope.$watch('isTraining', function() {
        if($scope.isTraining) { //oppens connection if there is a training happening
            connect();
        } else {
            disconnect();
        }
    })

});