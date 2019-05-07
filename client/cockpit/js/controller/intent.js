/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 
var app = angular.module('cockpitApp');

app.controller('intentCtrl', function($scope, project, leftBar, loading, messages, IntentService, confirmModal) {
  leftBar.show('intent');
  loading.hide();
  $scope.intentExamples = [];
  $scope.selectedIntent = {};
  $scope.intentRegistry = false;
  $scope.isEnable = true;
  $scope.enable = true;
  $scope.disable = !$scope.enable;

  var listDeleteExample = [];
  var listChannel = [];

  function loadIntents() {
    if (project.get()) {
      let nlpId = project.get().nlpEngineId;
      IntentService.list(nlpId).then(
        //SUCCESS
        function(res) {
          $scope.allIntents = res['data'];
        },
        //ERROR
        function(err) {
          console.log(err);
          messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
        }
      );
    }
  }
  loadIntents();
  function cleanErrorMessage() {
    $scope.selectedIntentError = {};
  }

  $scope.openFormIntent = (action, intent) => {
    listDeleteExample = []
    error = false;
    cleanErrorMessage();
    $scope.selectedIntent = angular.copy(intent);
    $scope.action = action;
    $scope.newExample = {'text':''};
    loadExampleIntents(intent['id']);
    $scope.intentRegistry = true;
    if(action=='edit') {
      $scope.isEnable = $scope.selectedIntent.enable;
    } else {
      $scope.isEnable = true;
    }
  }


  $scope.switchEnable = () => {
    $scope.isEnable = !$scope.isEnable;
    $scope.selectedIntent['enable'] = $scope.isEnable;
  }

  $scope.confirmCreateIntent = () => {
    $scope.selectedIntentError = {};
    var error = false;
    let nlpId = project.get().nlpEngineId;
    let intent = angular.copy($scope.selectedIntent);
    if(!intent.name) {
      error = true;
      $scope.selectedIntentError.name = 'REQUIRED-FIELD';
    }
    if(!intent.description) {
      error = true;
      $scope.selectedIntentError.description = 'REQUIRED-FIELD';
    }

    if (error) {
      error = false;
      return;
		}
		IntentService.create(intent, nlpId).then(
			(res) => { //SUCCESS
        loadIntents();
        ($scope.enable) ? loadEnable(1) : loadEnable(0); //FIXME
        messages.success(res['data']? (res.data['message']? res.data.message:JSON.stringify(res.data)): res);
        IntentService.getByName(intent['name'], nlpId).then(
          (res) => { //SUCCESS
            let intentId = res.data['id'];
            for (example of $scope.intentExamples) {
              insertExample(example, intentId);
            }
            $scope.intentExamples = [];
            $scope.intentRegistry = false;
          }
        );
			},
			(err) => { //ERROR
				console.log(err);
        messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
        $scope.intentExamples = [];
			}
    );
  }

  $scope.confirmEditIntent = () => {
    let intent = angular.copy($scope.selectedIntent);

    for (let l = 0; l < listDeleteExample.length; l++) {
  
      IntentService.deleteExample(listDeleteExample[l]).then(
        (res) => { //SUCCESS
          loadExampleIntents(intentId);
          messages.success(res['data'] ? (res.data['message'] ? res.data.message : JSON.stringify(res.data)) : res);
        },
        (err) => { //ERROR
          loadExampleIntents(intentId);
          console.log(err);
          messages.error(err['data'] ? (err.data['message'] ? err.data['message'] : JSON.stringify(err.data)) : JSON.stringify(err));
        }
      );
      
      
    }
       
    
		IntentService.update(intent['id'], intent).then(
      (res) => { //SUCCESS
        $scope.enable ? loadEnable(1) : loadEnable(0);
        // loadIntents();
				messages.success(res['data']? (res.data['message']? res.data.message:JSON.stringify(res.data)): res);
			},
			(err) => { //ERROR
        // loadIntents();
        $scope.enable ? loadEnable(1) : loadEnable(0);
				console.log(err);
        messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
        $scope.intentExamples = [];
			}
    );
    $scope.intentRegistry = false;
  }

  $scope.deleteIntent = (intent) => {
    $scope.selectedIntent = intent;
    confirmModal.show('INTENT.REMOVE','INTENT.REMOVE_TEXT', function() {
      let intentId = $scope.selectedIntent['id'];
    if (intentId) {
      IntentService.delete(intentId).then(
        (res) => { //SUCCESS
          ($scope.enable) ? loadEnable(1) : loadEnable(0);
          // loadIntents();
          messages.success(res['data']? (res.data['message']? res.data.message:JSON.stringify(res.data)): res);
        },
        (err) => { //ERROR
          ($scope.enable) ? loadEnable(1) : loadEnable(0);
          // loadIntents();
          console.log(err);
          messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
        }
      );
    } else {
      loadIntents();
      messages.error('Não foi possível encontrar o id do exemplo de intenção.');
    }
  });
  }

  function loadExampleIntents(intentId) {
    IntentService.listExamples(intentId).then(
      (res) => { //SUCCESS
        $scope.intentExamples = res['data'];
      },
      (err) => { //ERROR
        console.log(err);
        messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
      }
    );
  }

  function checkExample(newExample) {
    var nlpId = project.get().nlpEngineId;
    IntentService.checkExample(newExample, nlpId).then(
      function(res) {
        var amount = res['data'];
        if (amount>0) {
          // loadExampleIntents(intentId);
          messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
          //não faz nada e exibe uma mensagem que não vai cadastrar porque já tem um com esse texto no banco
        } else {
          //chama a função que inclui o exemplo de intenção na tela / lista
          $scope.intentExamples.push(newExample);
          // loadExampleIntents(intentId);
          $scope.newExample = {};
          // messages.success("{{'INTENT.EXAMPLE-REGISTRY' | translate}}");
        }
      },
      function(err) {
        console.log(err);
        messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
      }
    );
  }

  function insertExample(newExample, intentId) {
    let nlpId = project.get().nlpEngineId;
    IntentService.createExample(newExample, nlpId, intentId).then(
      (res) => { //SUCCESS
        loadExampleIntents(intentId);
        $scope.newExample = {};
        messages.success(res['data']? (res.data['message']? res.data.message:JSON.stringify(res.data)): res);
      },
      (err) => { //ERROR
        loadExampleIntents(intentId);
        console.log(err);
        messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
      }
    );
  }

  $scope.createIntentExample = function() {
    let action = $scope.action;
    let newExample = angular.copy($scope.newExample);
    if (action=='edit') {
      var intentId = $scope.selectedIntent['id'];
      insertExample(newExample, intentId);
    } else {
      if (!$scope.intentExamples) { $scope.intentExamples = []; }
        if(intentId) {
          $scope.intentExamples.push(newExample);
          insertExample(newExample, intentId);
        } else {
          $scope.intentExamples.forEach(example => {
            var e = example.text.toLowerCase();
            var ne = newExample.text.toLowerCase();
            if (e == ne) {
              $scope.exampleAlreadyExists = true;
              messages.error('EX-EXISTS');
            }
          });
          if(!$scope.exampleAlreadyExists) {
            checkExample(newExample);
          } else {
            $scope.exampleAlreadyExists = false;
          }
        }
        $scope.newExample = {}
        console.log($scope.intentExamples)
    }
  }

  $scope.deleteIntentExample = (example) => {

    var exampleId = example['id']; //example.id
    var intentId = $scope.selectedIntent['id'];
    if (exampleId) {

      listDeleteExample.push(exampleId)
      // messages.warning('Exemplo será excluído quando salvar a intenção!', 1000);
      messages.warning('DELETE-EXAMPLE', 2000);
      example.isHide = true;

    
    } else {
      for(var i=0; i< $scope.intentExamples.length; i++) {
        if (example.text == $scope.intentExamples[i].text) {
          $scope.intentExamples.splice(i, 1);
        }
      }
      // messages.error('Não foi possível encontrar o id do exemplo de intenção.');
      // loadExampleIntents(intentId);
    }
  }

  $scope.closeNewIntent = () => {
    $scope.intentRegistry = false;
  }

  function loadEnable(enable) {
    if(project.get()) {
      var nlpId = project.get().nlpEngineId;
      IntentService.listEnable(nlpId, enable).then(
        //SUCCESS
        function(res) {
          $scope.intents = res['data'];
        },
        //ERROR
        function(err) {
          console.log(err);
          messages.error(err['data']? (err.data['message']? err.data['message']:JSON.stringify(err.data)) :JSON.stringify(err));
        }
      );
    }
  }

  loadEnable(1);

  $scope.showEnable = function() {
      $scope.enable = true;
      $scope.disable = false;
      loadEnable(1);
  }

  $scope.showDisable = function() {
      $scope.enable = false;
      $scope.disable = true;
      loadEnable(0);
  }
  
});
