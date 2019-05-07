/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

var app = angular.module('cockpitApp');

app.controller('entityCtrl', function($scope,$timeout, project, leftBar, loading, messages, EntityService, confirmModal) {
    leftBar.show('entity');
    loading.hide();
    $scope.action = ''
    $scope.entityRegistry = false;
    $scope.entityCreating = false;
    $scope.isEnable = true;
    $scope.enable = true;
    $scope.disable = !$scope.enable;
    $scope.values = [];
    $scope.valuesView =[];
    $scope.entitySimples = [];
    $scope.entitySynonyms = [];
    $scope.busca = {
        'text':''
    }
    var itemsPerPage = 6;
    $scope.myEntities = [];
    $scope.blockPagination = false;
    let values = $scope.values;

    function loadMyEntities(page) {
      //remove();
      if(project.get()) {
          var nlpId = project.get().nlpEngineId;
        
          EntityService.list(nlpId, page).then(
              // SUCCESS
              function(res) {
                res['data'].forEach(function(a){
                    a.dif = new Date (a.updateDate).toLocaleString();
                })
                 //$scope.myEntities = res['data'];
              },
              // ERROR
              function(err) {
                  console.log(err);
                  messages.error(err['data'] ? (err.data['message'] ? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
              }
          );}
    }
    $scope.filterEntities = (page) => {
        $scope.currentPage = page;
        console.log('$scope.currentPage', $scope.currentPage);
        if(!page) page = 1;
        console.log('page: ', page);
          if(project.get()) {
              var nlpId = project.get().nlpEngineId;
            
              EntityService.list(nlpId, page).then(
                  // SUCCESS
                  function(res) {
                    res['data'].forEach(function(a){
                        a.dif = new Date (a.updateDate).toLocaleString();
                    })
                      $scope.myEntities = res['data'];
                      if(($scope.entityQtd/itemsPerPage) > 1) 
                    $scope.pages = Math.ceil($scope.entityQtd/itemsPerPage);
                  },
                  // ERROR
                  function(err) {
                      console.log(err);
                      messages.error(err['data'] ? (err.data['message'] ? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
                  }
              );}
        }
      loadMyEntities();
      $scope.filterEntities();
      countEntities();

    function countEntities (){
        if(project.get()) {
            var nlpId = project.get().nlpEngineId;
            
            EntityService.countEntities(nlpId).then(
                //SUCCESS
                function(resp){
                    $scope.entityQtd = resp['data'];
                    console.log($scope.entityQtd);
                },
                // ERROR
                function(err){
                    console.log(err);
                }
            )
        }

    }

    function loadSystemEntities() {
        console.log('entity: '+JSON.stringify($scope.data.values)); 

        EntityService.listSystemEntities().then(
            
            // SUCCESS
            function(res) {
                $scope.systemEntities = res['data'];
                console.log(res['data']);
            },
            // ERROR
            function(err) {
                console.log(err);
                messages.error(err['data'] ? (err.data['message'] ? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
            }
        )
    }

    $scope.switchEnable = (sentity) => {
        //$scope.isEnable = !$scope.isEnable;
        sentity.enabled = !sentity.enabled;
        EntityService.updateSystemEntity(sentity).then(
            (res) => { // SUCCESS
                messages.success(res['data']? (res.data['message']? res.data.message:JSON.stringify(res.data)): res);
            },
            (err) => { // ERROR
                messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
            }
        );
      }

    $scope.openFormEntity = (action, entity) => {
        cleanErrorMessage();
        

        let newSynonyms = [];
        $scope.createValue = {
                'text':'',
                newSynonyms
        };
            
        $scope.action = action;
        console.log($scope.action);

        if(action == 'create'){
            $scope.valuesView.length = 0;
            $scope.data.values.length = 0;
            values.length = 0;
            $scope.data = {
                name : '',
                id: null,
                type : null,
                pattern: '',
                values
            }   
        }
        
        if (action == 'edit'){
            $scope.valuesView.length = 0;
            $scope.data.values.length = 0;
            values.length = 0;
            $scope.data.pattern = '';
            $scope.createValue = {'text':'', newSynonyms};
            $scope.data.id = entity.id;
            $scope.data.name = entity.name;
            $scope.data.type = entity.type;
            if(entity.type == 'Pattern'){
                $scope.data.pattern = entity.pattern
            }
            loadSimpleEntities(entity.id).then(
            response => {
                response.data.forEach(function(simple) {
                    console.log(simple.name);
                    var value = simple.name;
                    var newSynonyms = [];
                    var id = simple.id
                    loadSynonymEntities(simple.id).then(
                        resp => {
                            resp.data.forEach(function(synonym) {
                                console.log(synonym.name);
                                console.log("en el for de sinonimos: simple --< "+simple.name);
                                newSynonyms.push({'text': synonym.name});
                            });
                        }, error => console.error(error)
                    ).catch(error=>console.error(error));
                    $scope.data.values.push({'id':id,'value': value, newSynonyms});
                    $scope.valuesView.push({'id':id,'value': value, newSynonyms});
                });
                
            }, 
            error => console.error(error)
        ).catch(
            error => console.error(error)
        );
        console.log("data: "+JSON.stringify($scope.data));
        $scope.entityCreating = true;
        }
    
        $scope.entityCreating = true;
    }

  


    $scope.confirmCreateEntity = () => {
        
        if (validateFormEntity() == false){
            return
        };
    
        let newValue = $scope.createValue.text;
        let newSynonyms = $scope.createValue.newSynonyms;
        if(newValue && newSynonyms){
            a = {
                'value': newValue,
                newSynonyms
            }
            $scope.data.values.push(a);
        }
        console.log($scope.data)
        let nlpId = project.get().nlpEngineId;
        let entity = angular.copy($scope.data);
        console.log($scope.data.values)
        
    if($scope.action != 'edit') {

        if($scope.data.type == 'Pattern') {
        EntityService.create(entity, nlpId).then(
            (res) => { //SUCCESS
                console.log("RESULTADO: ");
            console.log(res);
            messages.success(res['data']? (res.data['message']? res.data.message:JSON.stringify(res.data)): res);
            $scope.entityCreating=false;
            $scope.filterEntities(1);
            countEntities();
            },
            (err) => { //ERROR
                console.log(err);
                messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
            }
        );
            } 
        else if ($scope.data.type == "Synonym") {
            EntityService.create(entity, nlpId).then(
                (res) => { // SUCCESS
                    messages.success(res['data']? (res.data['message']? res.data.message:JSON.stringify(res.data)): res);
                    EntityService.getByName(entity['name'], nlpId).then( // get Entity's Id
                        (res) => { // SUCCESS
                        let entityId = res.data['id'];
                        for (value of $scope.data.values) { 
                        insertSimple(value, entityId)
                        .then(
                                response => {
                                    console.log(res);
                                    EntityService.getSimpleByName(response.config.data.value).then ( // get Simple's id
                                    (res) => {
                                        let simpleId = res.data['id'];
                                        for (synonym of response.config.data.newSynonyms) { // insert all synonyms
                                            console.log(synonym, simpleId);
                                            insertSynonym(synonym, simpleId);
                                        }
                                    
                                    }
                                    )
                                },
                                error => console.error(error)
                            ).catch(
                                error => console.error(error)
                            );
                        }
                        $scope.entityCreating = false
                        $scope.filterEntities(1);
                        countEntities();
                        console.log($scope.myEntities)
                        }
                    
                    )
                },
                (err) => { // ERROR
                    messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
                }
            );
        }

    } else {
        
        
        updateEntityName($scope.data.id, $scope.data).then(
            response => {
                $scope.entityCreating=false;
                $scope.filterEntities($scope.currentPage);
                countEntities();
                if(newValue && newSynonyms){
                    $scope.addNewValue();
                }
                if ($scope.data.type == "Synonym") {
                $scope.valuesView.forEach(function(value) {
                    if(value.id) {
                        // edit
                        updateSimpleName(value.id, value);
                    }
                    else {
                        // new value
                        insertSimple(value, $scope.data.id).then(
                            response => {
                                EntityService.getSimpleByName(response.config.data.value).then (
                                    (resp) => {
                                        let simpleId = resp.data['id'];
                                        response.config.data.newSynonyms.forEach(function(synonym) {
                                            insertSynonym(synonym, simpleId);
                                        })
                                    }
                                )
                            }
                        )
                    }
                    
                }) 
                }                
            }
        );
        $scope.entityCreating = false
        $scope.filterEntities($scope.currentPage);
        countEntities();
        
    }

    }
    
    
    $scope.closeNewEntity = () => {
        $scope.entityCreating = false;
        cleanErrorMessage();
        $scope.filterEntities($scope.currentPage);
        countEntities();
    }
    function cleanErrorMessage() {
      $scope.selectedEntityError = {};
    }

    $scope.$watch('valuesView', function() {
        console.log($scope.valuesView);
    });

    function validateFormEntity (){
        $scope.selectedEntityError = {};
        let error = false;

        if(!$scope.data.name){
            error = true;
            $scope.selectedEntityError.name = 'REQUIRED-FIELD';
            console.log($scope.emptyEntity)
        }
        if(!$scope.data.type){
            error=true;
            $scope.selectedEntityError.type = 'REQUIRED-FIELD';
        }
        if ($scope.data.type == 'Pattern'){
            if(!$scope.data.pattern){
                error=true;
                $scope.selectedEntityError.pattern = 'REQUIRED-FIELD';
            }
        }
        if($scope.data.type == 'Synonym'){

            if(!$scope.valuesView.length && !$scope.data.values.length){
                if($scope.createValue.newSynonyms &&  $scope.createValue.newSynonyms.length == 0){
                    $scope.selectedEntityError.synonym = 'REQUIRED-FIELD';
                    error= true;
                }
    
                if(!$scope.createValue.text){
                    let myEl = angular.element( document.querySelector( '.tags' ) );
                    myEl.addClass('error');
                    error=true;
                    $scope.selectedEntityError.value = 'REQUIRED-FIELD';
                }
            }
        }
        if(error){
            error=false;
            return false;
        }
    }
      

    $scope.data = {
      name : '',
      id: null,
      type : null,
      pattern: '',
      values
    }



    $scope.deleteEntity = (entity) => {
        $scope.selectedEntity = entity;
        confirmModal.show('ENTITY.REMOVE', 'ENTITY.REMOVE_TEXT', function() {
            let entityId = $scope.selectedEntity['id'];
            if(entityId) {
                EntityService.delete(entityId).then(
                    (res)=> {
                       // $scope.currentPage=1;
                        messages.success(res['data']? (res.data['message']? res.data.message:JSON.stringify(res.data)): res);
                        countEntities();
                        $scope.filterEntities($scope.currentPage);
                    },
                    (err)=> {
                        console.log(err);
                        messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
                    }
                )
            } else {
                $scope.filterEntities($scope.currentPage);
                countEntities();
                messages.error('Não foi possível encontrar o id do entidade.');
              }
        });
    }

    $scope.showEnable = function() {
        $scope.enable = true;
        $scope.disable = false;
        $scope.filterEntities($scope.currentPage);
        countEntities();
    }

    $scope.showDisable = function() {
        $scope.enable = false;
        $scope.disable = true;
        loadSystemEntities();
    }

    $scope.hideError = function(){
        let myEl = angular.element( document.querySelector( '.tags' ) );
        myEl.removeClass('error');
        $scope.selectedEntityError.synonym = '';
    }

    
    $scope.addNewValue = () =>{
        let a = {};
        let newValue = $scope.createValue.text;
        let newSynonyms = $scope.createValue.newSynonyms;
        console.log(newSynonyms);
        a = {
            'value': newValue,
            newSynonyms
        }
        $scope.values.push(a);
        $scope.valuesView.push(a);

        $scope.createValue.text = null;
        $scope.createValue.newSynonyms = null ;

    }

    $scope.deleteValue = (x) => {
        if($scope.action == 'edit') {
            EntityService.deleteSimple(x.id).then(
                (res) => { // SUCCESS
                    
                },
                (err) => { // ERROR
                    messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
                }
            )
        }
        for(var i=0; i< values.length; i++) {
            if (x.value == values[i].value) {
                values.splice(i, 1);
            }
        }
        
        for(var i=0; i< $scope.valuesView.length; i++) {
            if (x.value == $scope.valuesView[i].value) {
                $scope.valuesView.splice(i, 1);
            }
        }
    }

    $scope.addTag = (entityId,tag,action) =>{
        if(action == 'edit'){
            if(entityId) 
            insertSynonym(tag , entityId);
        }else{
            console.log('Estoy creando')
        }
        
    }

    $scope.removeTag = (entityId,tag,action) => {
        if(action == 'edit'){
          removeSynonym(tag.text, entityId);
        }else{
            console.log('tag removido del create')
        }
    }

    function insertSimple(newSimple, entityId) {
        let nlpId = project.get().nlpEngineId;
        return new Promise((resolve, reject) => {
            EntityService.createSimple(newSimple, nlpId, entityId).then(
                (res) => { // SUCCESS
                    resolve(res);
                },
                (err) => { // ERROR
                    messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
                    reject(err);
                }
            );
        });
    }

    function loadSimpleEntities(entityId) {
        return new Promise((resolve, reject) => {
            EntityService.listSimples(entityId).then(
                (res) => {
                    resolve(res);
                },
                (err) => {
                    console.log(err);
                    messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
                    reject(err);
                }
            )
        });
        
    }

    function loadSynonymEntities(simpleId) {
        var nlp = project.get().nlpEngineId;
        return new Promise((resolve, reject) => {
            EntityService.listSynonyms(simpleId, nlp).then(
                (res) => {
                    resolve(res);
                },
                (err) => {
                    console.log(err);
                    messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
                    reject(err);
                }
            )
        });
    }

    function insertSynonym(newSynonym, simpleId) {
        EntityService.createSynonym(newSynonym, simpleId).then(
            (res) => { // SUCCESS

            },
            (err) => { // ERROR
                messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
            }
        );
    }
    function removeSynonym(newSynonym, simpleId){
        EntityService.deleteSynonym(newSynonym, simpleId).then(
            (res) => { // SUCCESS
    
            },
            (err) => { //ERROR
                messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.strinify(err));
            }
        )
    }

    function updateSimpleName(simpleId, simple) {
        //var smple = {'name': 'wwwwwwwwwwwwweeeeeeeeeeeeeeeeeeee'};
        EntityService.updateSimpleName(simpleId, simple).then(
            (res) => { // SUCCESS

            },
            (err) => { // ERROR
                messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
            }
        );
    }


    function updateEntityName(entityId, entity) {
        //var entity = { 'name': 'aqwewqdsadas' };
        return new Promise((resolve, reject)=> {
            EntityService.updateEntityName(entityId, entity).then(
                (res) => { // SUCCESS
                    messages.success(res['data']? (res.data['message']? res.data.message:JSON.stringify(res.data)): res);
                    resolve(res);
                },
                (err) => { // ERROR
                    messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
                    reject(err);
                }
            );
        })
        
    }

    /// PAGINATION ////
    $scope.viewby = 5;
    $scope.totalItems = $scope.myEntities.length;
    $scope.currentPage = 1;
    $scope.itemsPerPage = $scope.viewby;
    $scope.maxSize = 5; //Number of pager buttons to show

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        console.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.addPage = function(n) {
        $scope.setPage($scope.currentPage + n);
    };

    $scope.setItemsPerPage = function(num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first page
    }

    /////////////////////

});
