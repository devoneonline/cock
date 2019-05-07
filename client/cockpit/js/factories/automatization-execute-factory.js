/*
* eVA
* Version: 2.0
* copyright (c) 2018 everis Spain S.A
* Date: 06 February 2019
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Oscar Carantón, Aric Gutierrez.
* All rights reserved
*/ 


(function(){
    'use strict'
    angular.module('cockpitApp').factory('AutomatizationExecuteFactory', 
        ['AutomatizationServices' , 'project' , 'userInfo' , '$translate' , 
        function ( AutomatizationServices , project ,userInfo , $translate){
            var methods = {};
            var MODULE_ACTIVE = 'detail';

            var labelsDetail = [];
            var valuesDetail =[];
            var datasetOverride = [{
                backgroundColor :["#67E3A3", "#F1F17E", "#FA8E8B"],
                borderColor :["#67E3A3", "#F1F17E", "#FA8E8B"],
                hoverBackgroundColor :["rgba(104, 227, 164, 0.7)", "rgba(241, 241, 126, 0.7)", "rgba(250, 141, 137, 0.7)"],
                hoverBorderColor :["#67E3A3", "#F1F17E", "#FA8E8B"]
            }];

            
            var baseUri = function () {
                if (project.get() && project.get().id) {
                    return "/cockpit/v1/projects/" + project.get().id + "/channels/";
                }
            }
        
            methods.loadChannels = function() {
                return AutomatizationServices.loadChannels(baseUri());
            };

            methods.sendFile = ( file , nameTest , idChannel)=>{
                let projectSend = project.get().id;
                let channelSend = idChannel;
                let userSend = userInfo.get().id;
                console.log("nameTest" , nameTest);
                console.log("idChannel" , idChannel);
                return AutomatizationServices.sendFile(file , userSend , projectSend , channelSend , nameTest);
            }

            methods.sendExecute = (id) =>{
                var promise = new Promise((success , reject)=>{
                    AutomatizationServices.sendExecute(id).then(
                        (resultSuccess)=>{
                            console.log(resultSuccess);
                            var result = resultSuccess.data;
                            var dataSuccess = {
                                graphic : {
                                    "labels" : result.data.labels,
                                    "data" : {
                                        "datasets": [{
                                            "data": [result.data.grafic]
                                        }],
                                    },
                                    "options" : methods.getOptions(),
                                    "datasetOverride" : methods.getDatasetOverride()
                                },
                                "asert" : result.assert,
                                "uterrance" : result.uterrance,
                                "result" : result.data.table,
                            }
                            success(dataSuccess);
                        },
                        (error)=>{
                            // console.log("error",error);
                            reject(error);
                        }
                    )});
                return promise;
            }
            methods.sendPagination = (idTest , page , filter) =>{
                console.log("project" , project.get());
                console.log("userInfo" , userInfo.get());
                
                return AutomatizationServices.sendPagination(idTest , page, filter , MODULE_ACTIVE);
            }

            methods.sendDuplicate = ( idTest )=>{
                // return AutomatizationServices.sendDuplicate(idTest);
                var promise = new Promise((success , reject)=>{
                    AutomatizationServices.sendDuplicate(idTest).then(
                        (resultSuccess)=>{
                            // console.log(resultSuccess);
                            var result = resultSuccess.data;
                            var dataSuccess = {
                                graphic : {
                                    "labels" : result.data.labels,
                                    "data" : [result.data.grafic],
                                    // "options" : methods.getOptions(),
                                    "datasetOverride" : datasetOverride
                                },
                                "asert" : result.assert,
                                "uterrance" : result.uterrance,
                                "result" : result.data.table,
                            }
                            success(dataSuccess);
                        },
                        (error)=>{
                            // console.log("error",error);
                            reject(error);
                        }
                    )});
                return promise;
            }

            methods.getOptions =(scope)=>{
                return {
                    responsive: true,
                    cutoutPercentage: 75,
                    title: {
                        display: true,
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    },
                    onClick : function (evt, item) {
                        scope.sendGraphicDispersion(item[0]._view.label);
                    },
                    tooltips: {
                        titleFontSize : 18,
                        bodyFontSize : 18,
                        xPadding : 10,
                        yPadding : 10,
                        cornerRadius : 0,
                        callbacks: {
                            label: function(tooltipItem, data) {
                                var label = '';
                                label = $translate.instant('LEFT-BAR-AUTOMATIZATION.TOTAL_INTENTION') +" "+data.datasets[0].data[tooltipItem.index];
                                return label;
                            }
                        }
                    }
                };
            }

            methods.getDatasetOverride =()=>{
              console.log("resolviendo", datasetOverride);
                return datasetOverride;
            }

            methods.getGraphics = (idTest) =>{
                return AutomatizationServices.getGraphics(idTest);
            }

            methods.getOptionsDetail= ()=>{
                return  {
                  responsive: true,
                    tooltips: {
                        titleFontSize : 14,
                        bodyFontSize : 14,
                        xPadding : 5,
                        yPadding : 5,
                        cornerRadius : 0,
                        callbacks: {
                            label: function(tooltipItem, data) {
                                var label = '';
                                 console.log("valuesDetail[tooltipItem.index]" , valuesDetail[tooltipItem.index]);
                                // + '( '+(valuesDetail[tooltipItem.index] * 100).toFixed(2)+'% )'
                                label = labelsDetail[tooltipItem.index] ;
                                console.log("label!!!", label);
                                return label;
                            }
                        }
                    },
                    scales: {
                        yAxes: [{
                            id: 'y-axis-1',
                            type: 'linear',
                            display: true,
                            position: 'left',
                        //     gridLines: {
                        //         display:false
                        //    },
                            ticks: {
                                beginAtZero: true,
                                min: -0.1,
                                max: 1.1,
                                display : true,
                                fontSize : 1
                              },
                              scaleLabel: {
                                display: true,
                                labelString: 'Nivel de acertividad'
                              }
                        }],
                        xAxes: [{
                          display: true,
                          gridLines: {
                            display:true
                          },
                          ticks: {
                            display : true,
                            fontSize : 1
                          },
                          scaleLabel: {
                            display: true,
                            labelString: 'Intensiones'
                          }
                        }]
                        
                    }
    
                  };
                }

            methods.getDatasetOverrideDetail  = () =>{
                return [{ 
                    yAxisID: 'y-axis-1',
                    backgroundColor: "#F1F17E",
                    borderColor: "#F1F17E",
                    borderWidth: 0,

                    fill: false,
                    pointRadius: 7,
                    pointBorderWidth: 0,
                    pointBackgroundColor: "#F1F17E",
                    showLine : false,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: "#F1F17E",
                    pointOverflow: "visible",
                    pointHoverBorderColor: "rgba(255, 255, 255, 0.6)",
                    pointHoverBorderWidth: 5,
                    fontSize: '12px'
                }];
            }

            methods.getDataDetail = (arrayValues, arrayLabels , key)=>{
                var limit = [];
                var objectReturn = {
                    values: [],
                    labels:[]
                };
                if (key == 'Alto') {
                    limit.push(0.8);
                    limit.push(1);
                } else if (key == 'Medio') {
                    limit.push(0.5);
                    limit.push(0.7999);
                } else{
                    limit.push(0);
                    limit.push(0.5);
                }
                // console.warn("limit ", limit);
                labelsDetail=[];
                for (var index = 0; index < arrayValues.length; index++) {
                    if (arrayValues[index] >= limit[0] && arrayValues[index] <= limit[1]) {
                        var value = (arrayValues[index])?arrayValues[index]:0;
                        objectReturn.values.push(value);
                        objectReturn.labels.push("");
                        valuesDetail.push(value);
                        labelsDetail.push(arrayLabels[index]);
                    } 
                }
                // console.warn("objectReturn ", objectReturn);
                return objectReturn;
            }
            return methods;
        }
])})();