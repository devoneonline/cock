/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

var app = angular.module("cockpitApp");

app.controller('sample-searchCtrl',function($scope, $http, $location, leftBar, confirmModal, messages, project, loading) {
    
    leftBar.show('sample-search');

    var uri;
    var sampleData = {};

    $scope.startDate = `01/0${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
    $scope.endDate = `${new Date().getDate()}/0${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
    $scope.date = `${$scope.startDate} - ${$scope.endDate}`;


    $scope.channels = [];
    $scope.samples = [];
    $scope.sample = {};
    $scope.sampleKPI = {};
    $scope.page = 1;
    $scope.showResults = false;
    $scope.showNotFind = false;


    //Config DatePicker
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
        buttonClasses: 'filter-btn',
        startDate: $scope.startDate,
        endDate: $scope.endDate,
        });
        $('button').removeClass("btn-default btn-success");
        $('.cancelBtn').before('<br><br>');
        $('.calendarie-icon').click(function(){
            $('.date-filter').click();
    });

    
    //Btn filter
    $scope.filter = function(){
        
        var first = true;
        uri = '/cockpit/v1/projects/' + project.get().id +  '/samples/export';

        if($scope.outputChannels){
            var channels = [];
            for(i in $scope.outputChannels)
                channels.push($scope.outputChannels[i].id);
            if(channels.length > 0){
                sampleData.channelId = channels;
                uri += '?channelId=['+ channels.toString() + ']';
                first = false;
            }else{
                sampleData.channelId = '';
            }
        }
        
        if($scope.date){
            var fullDate = $scope.date;
            var splitDate = fullDate.split(" - ");
            sampleData.startDate = splitDate[0].split('/').reverse().join('/');
            sampleData.endDate = splitDate[1].split('/').reverse().join('/');

            $scope.startDate = splitDate[0].split('/').reverse().join('-');
            $scope.endDate = splitDate[1].split('/').reverse().join('-');
            uri += (first ? '?' : '&')+'startDate='+$scope.startDate+'&endDate='+$scope.endDate;
            first = false;
        }

        $scope.page = 1;
        $scope.loadSampleTable(true);
        $('.get-more-samples').css('display', 'block');
    }


    //Sample Load service
    $scope.loadSampleTable = function(filter){
        sampleData.page = $scope.page++;
        $scope.loading = true;
        $scope.filtroSelecionado = filter;

        $http.post('/cockpit/v1/projects/' + project.get().id +  '/samples/search',sampleData).then(
        
            //SUCCESS
            function(res){
                if(filter){
                    $scope.samples = res.data.samples;
    
                    //KPI
                    $scope.sampleKPI.sumSamples = res.data.sumSamples;
                    $scope.sampleKPI.avgAssertiveness = res.data.avgAssertiveness;                           
                }
                else{
                    var len = $scope.samples.length;
                    for(i in res.data.samples){
                        $scope.samples.push(res.data.samples[i]);
                    }
                    
                    if(len == $scope.samples.length)
                        $('.get-more-samples').css('display', 'none');

                }
                
         
                $scope.showResults = ($scope.samples.length > 0) ? true : false;
                $scope.showNotFind = true;
                $scope.samplesQty = res.data.count;
                $scope.loading = false;
                console.log($scope.loading);
            },
            //ERROR
            function(err){
                $scope.loading = false;
                console.log(err)
                messages.error('ERROR');
            }
        )
    }


    //Channel Load service to filter
    $scope.loadChannel = function(){
        $http.get('/cockpit/v1/projects/' + project.get().id +  '/channels').then(function(res){
            for(i in res.data){
                res.data[i].name;
                $scope.channels.push({name: res.data[i].name, id: res.data[i].id});
                loading.hide();
            }
        });
    }


    //Export service
    $scope.exportSessions = function(){
        console.log(uri);
        window.location.href = uri;
    }

    //Load channels in filter
    $scope.loadChannel();

});