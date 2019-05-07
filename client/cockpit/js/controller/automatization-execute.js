/*
* eVA
* Version: 2.0
* copyright (c) 2018 everis Spain S.A
* Date: 06 February 2019
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Oscar Carantón, Aric Gutierrez.
* All rights reserved
*/

var app = angular.module("cockpitApp");
app.controller('automatizationExecuteCtrl', ["$scope", "$stateParams", "AutomatizationExecuteFactory", "$sce",
    function ($scope, $stateParams, AutomatizationExecuteFactory, $sce) {
        $scope.id = $stateParams.id || '';
        $scope.autoStart = $stateParams.start || false;
        $scope.existTest = $stateParams.exist || false;
        $scope.nameFile = '';
        $scope.loading = false;
        $scope.detalle = false;
        $scope.channel = [];
        $scope.nameTestAutomatization    = "";
        $scope.nameChannel = "";
        $scope.flagPaginationTest = false;
        $scope.executeTest = false;
        $scope.testSelected = 0;
        $scope.valueFilter = 100;
        $scope.pageSelectedFront = 0;
        $scope.slider = {
            value : 0 ,
            options : {}
        }
        $scope.graphicDetail={
            data: [],
            labels : [],
            options:{

            },
            datasetOverride : {
                showLines: false, 
            }
        };
        $scope.pagination = {
            view: false,
            pageactual: 0,
            pageBack: 0,
            pageNext: 0,
            labelSelect: 0,
            labelNext: 0,
            total: 0
        }
        $scope.result = {
            graphic: [],
            asert: '',
            uterrance: '',
            data: [],
            pageSelect: '',
            totalPage: ''
        };

         
        $scope.initPage = () => {

            AutomatizationExecuteFactory.loadChannels().then(
                (succes)=>{
                    console.log(succes);
                    $scope.channel = succes.data;

                },(error)=>{
                    console.error(error);
                }
            );

            if ($scope.id != '') {
                if ($scope.autoStart) {
                    $scope.loading = true;
                    if ($scope.existTest) {
                        AutomatizationExecuteFactory.sendDuplicate($scope.id).then(
                            (success) => {
                                $scope.loading = false;
                                $scope.executeTest = true;
                                $scope.result = success;
                                $scope.processData(success.result);
                                $scope.renderGraphic();
                            }
                        );
                    } else {
                        AutomatizationExecuteFactory.sendExecute($scope.id).then(
                            (success) => {
                                $scope.loading = false;
                                $scope.executeTest = true;
                                $scope.result = success;
                                $scope.processData(success.result);
                                $scope.renderGraphic();
                            }
                        );
                    }
                } else {
                    $scope.loading = true;
                    AutomatizationExecuteFactory.sendPagination($scope.id, $scope.pageSelectedFront , $scope.valueFilter).then(
                        (success) => {
                            $scope.processData(success.data);
                            $scope.loading = false;
                            $scope.executeTest = false;
                            $scope.renderGraphic();
                        },
                        (error) => {
                            console.log("error", error);
                        }
                    );
                }
            }
        }

        $scope.renderGraphic = ()=>{

            AutomatizationExecuteFactory.getGraphics($scope.id).then(
                (response) => {
                    
                    //purgando para graficador
                    var dataGraphics = response.data;
                    var dataDonut = [];
                    dataDonut.push(0);
                    dataDonut.push(0);
                    dataDonut.push(0);
                    for (var index = 0; index < dataGraphics.data.grafic.length; index++) {
                        if (dataGraphics.data.grafic[index] >= 0.8 && dataGraphics.data.grafic[index] <= 1) {
                            dataDonut[0] = dataDonut[0] + 1;
                        } else if (dataGraphics.data.grafic[index] >= 0.5 && dataGraphics.data.grafic[index] < 0.8) {
                            dataDonut[1] = dataDonut[1] + 1;
                        } else {
                            dataDonut[2] = dataDonut[2] + 1;
                        }
                    }

                    $scope.result.graphic.options = AutomatizationExecuteFactory.getOptions($scope);
                    $scope.result.graphic.datasetOverride = AutomatizationExecuteFactory.getDatasetOverride();
                    $scope.result.graphic.data = [ dataDonut];
                    $scope.result.graphic.labels = ["Alto", "Medio", "bajo"];
                    $scope.result.graphic.detailGraphic = dataGraphics.data.grafic;
                    $scope.result.graphic.detailLabels = dataGraphics.data.labels;
                    $scope.result.asert = dataGraphics.assert;
                    $scope.result.uterrance = dataGraphics.uterrance;
                    $scope.executeTest = true;
                    console.log("$scope.result" , $scope.result);
                }, (error) => {

                    console.error("response" , error);
                    $scope.loading = false;
                    $scope.executeTest = false;
                });
        }

        
        

        $scope.sendGraphicDispersion = function(key){
            var objReturn = AutomatizationExecuteFactory.getDataDetail($scope.result.graphic.detailGraphic , $scope.result.graphic.detailLabels , key);
            $scope.graphicDetail.datasetOverride = AutomatizationExecuteFactory.getDatasetOverrideDetail();
            $scope.graphicDetail.options = AutomatizationExecuteFactory.getOptionsDetail();
            console.log("opciones", objReturn.labels);
            $scope.detalle = true;
            $scope.$apply(function () {
                $scope.graphicDetail.data = [ objReturn.values ];
                $scope.graphicDetail.labels = objReturn.labels;
            });
            setTimeout(() => {
              document.getElementsByClassName('graphic')[0].classList.add('ancho');
            }, 200);
        };

        $scope.offDetail = function(){
            $scope.detalle = false;
        };

        $scope.trustAsHtml = function (string) {
            return $sce.trustAsHtml(string);
        };

        $scope.startTest = () => {
            $scope.loading = true;
            console.log("$scope.testSelected" , $scope.testSelected);
            AutomatizationExecuteFactory.sendExecute($scope.testSelected).then(
                (success) => {

                    $scope.loading = false;
                    $scope.executeTest = true;
                    $scope.result = success;
                    $scope.processData(success.result);

                    $scope.id = $scope.testSelected;
                    $scope.renderGraphic();
                }
            );
        }

        $scope.onChangePagination = (page) => {
            $scope.pageSelectedFront = page;
            $scope.loading = true;
            AutomatizationExecuteFactory.sendPagination($scope.testSelected, $scope.pageSelectedFront, $scope.valueFilter).then(
                (result) => {
                    $scope.processData(result.data);
                },
                (error) => {
                    console.log("error", error);
                }
            );
        }
        $scope.loadFileAndDoTest = ()  => {
            $scope.selectedFile = (value) => {
                $('#disclaimerModal').modal({"show":true}); 
                //prueba
                $scope.loading = true;
                $scope.executeTest = false;
                let name = document.getElementById("nameTestAutomatization").value;
                let channel = document.getElementById("optionsChannel").value;
                AutomatizationExecuteFactory.sendFile(value , name  , channel)
                .then(
                    (result) => {
                        $scope.nameFile = value.name;
                        $scope.executeTest = false;
                        $scope.processData(result.data);
                    },
                    (error) => {
                        console.log("error", error);
                    }
                );
            };
            $('#disclaimerModal').modal("hide");
        }
        

        $scope.textConfidence = (item) => {
            return item * 100;
        }

        $scope.colorBackground = (input) => {
            if($scope.executeTest){
                var porcentaje = input * 100;
                if (porcentaje != '' && porcentaje) {
                    if (parseInt('' + porcentaje) > 75) {
                        return '#67E3A3';
                    } else if (parseInt('' + porcentaje) > 49) {
                        return '#F1F17E';
                    } else {
                        return '#FA8E8B';
                    }
                }else{
                    return '#FA8E8B';
                }
            }
            return 'white';
        }

        $scope.colorText = (input) => {
            var porcentaje = input * 100;
            if (porcentaje != '') {
                if (parseInt('' + porcentaje) > 75) {
                    return 'white';
                } else if (parseInt('' + porcentaje) > 49) {
                    return 'black';
                } else {
                    return 'white';
                }
            }
            return 'black';
        }

        $scope.compareText = (text, answer) => {
            text = (text || '');
            answer = (answer || '');
            if (text != '' && answer != '') {
                return diff_text(text, answer);
            }
            else {
                return '';
            }
        }

        $scope.processData = (success, execute) => {
            $scope.loading = false;
            $scope.result.data = success.result;
            let pageactual = success.pageSelect - 1;
            let pageTotals = success.pageTotal;
            $scope.testSelected = success.idTest;
            $scope.pagination.pageactual = pageactual;
            $scope.pagination.view = (1 < success.pageTotal);
            $scope.pagination.pageBack = (pageactual > 0) ? (pageactual - 1) : 0;
            $scope.pagination.pageNext = ((pageactual + 1) < pageTotals) ? (pageactual + 1) : (pageTotals - 1);
            $scope.pagination.total = pageTotals;
            $scope.pagination.labelSelect = pageactual + 1;
            if ((pageactual + 1) < pageTotals) {
                $scope.pagination.labelNext = (pageactual + 2);
            } else {
                $scope.pagination.labelNext = pageTotals;
                $scope.pagination.labelSelect = pageactual;
            }

            
            
        }
        
        
        $scope.filter = ()=>{
            $scope.slider = {
                value: 100,
                options: {
                    floor: 25,
                    interval: 5,
                    hidePointerLabels: true,
                    hideLimitLabels: true,
                    ceil: 100,
                    step: 1,
                    minLimit:25,
                    maxLimit : 100,
                    minRange: 0,
                    maxRange: 100,
                    showTicksValues: false,
                    showTicks: false,
                    noSwitching: true,
                    onEnd: (sliderId, modelValue, highValue, pointerType) => {
                        console.log("Event end ", sliderId, modelValue, highValue, pointerType);
                        $scope.valueFilter = modelValue;
                        $scope.onChangePagination($scope.pageSelectedFront);
                    }
                }
            };
        }
        setTimeout(()=>{
            $scope.$apply(function () {
                $scope.filter()
            });
        },100);

        //AutoRun
        $scope.initPage();
    }]);
