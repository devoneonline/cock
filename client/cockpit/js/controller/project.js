/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

var app = angular.module("cockpitApp");
var selectedProject = {}
var jsonFile;

app.controller('projectsCtrl',function($scope, $http, $state, leftBar, confirmModal, messages, project, loading, cacheCleanerService, ProjectService, userService, userInfo, bindFileRead) {
	leftBar.hide();
	$scope.project = {};
	$scope.projectError = {};
	$scope.userinfo = userInfo.get();
	$scope.currentStep = 1;
	$scope.actualStep = $scope.currentStep;
	$scope.totalSteps = 0;
	$scope.isEnable = false;
	$scope.fileName = '';
	$scope.fileNameErr = false;

	$scope.project = selectedProject;
	$scope.$watch(function(){
		   return bindFileRead.get();
		}, function(newValue, oldValue){
			// var jsonkey = JSON.parse(JSON.stringify(newValue));
			$scope.project["jsonmetadata"] = newValue;
		}); 	

	if($scope.project.api_key) {
		$scope.isEnable = true;
	}

	var projNlp = $scope.project.nlp;

	$scope.nlps = [
		// {'id':'1',	'name':'Clever',	'img':'clever_logo.png',	'selected':0},
		{'id':'2',	'name':'Luis',		'img':'luis_logo.png',		'selected':0},
		{'id':'3',	'name':'Watson', 	'img':'watson_logo.png',	'selected':0},
		{'id':'4',	'name':'DialogFlow', 	'img':'dialogflow_logo.png',	'selected':0},
		// {'id':'5',	'name':'QnA Maker',	 	'img':'qnamaker.png',	'selected':0},
	];

	$scope.steps;

	$scope.loadProjects = function() {
		ProjectService.load().then(
			function(res){ //SUCCESS

				var projects = res.data;
				if (userInfo.get().statusAdmin) {
					for (var i = 0; i < projects.length; i++) {
						var metadata = JSON.parse(projects[i].metadata);
						if(metadata.type){
							projects[i].jsonmetadata = metadata;
						} else{
							projects[i].metadata = metadata;
						}
					}
				}
				$scope.projects = projects;
				//Add index number in projets to use in the Qlik
				for (i in $scope.projects) {
					$scope.projects[i].order = i;
				}
				resizeProjects($scope.projects.length + 1);
				loading.hide();
			}
		)
	};

	var projMetadata = new Array;

	$scope.selectNLP = function (nlp) { // 1(clever), 2(luis), 3(watson), 4(dialogflow), 5(QnA)
		$scope.fileNameErr = false;
		$scope.project['nlp'] = nlp;
		projMetadata.push($scope.project.metadata);
		if(projNlp !== nlp  && !nlpModded) {
			$scope.project.metadata = {};
		}
		if(projNlp == nlp && angular.equals($scope.project.metadata, {})) {
			$scope.project.metadata = projMetadata[0];
		}

		$scope.projectError['nlp'] = '';
		for (nlpItem of $scope.nlps) {
			if (nlpItem.id === nlp) {
				nlpItem['selected'] = 1;
				openNlpModal(nlpItem.id);
			} else {
				nlpItem['selected'] = 0;
			}
		}
	}

	function openNlpModal(selectedNlpId) {
		var nlpId = parseInt(selectedNlpId);

		switch(nlpId) {
			case 1:
				$scope.currentStep = 1;
				$scope.actualStep = $scope.currentStep;
				$scope.totalSteps = 1;
				$('#cleverModal').modal({"show":true});
				break;
			case 2:
				$scope.currentStep = 1;
				$scope.actualStep = $scope.currentStep;
				$scope.totalSteps = 2;
				$('#luisModal').modal({"show":true});
				break;
			case 3:
				$scope.currentStep = 1;
				$scope.actualStep = $scope.currentStep;
				$scope.totalSteps = 2;
				$('#watsonModal').modal({"show":true});
				break;
			case 4:
				$scope.currentStep = 1;
				$scope.actualStep = $scope.currentStep;
				$scope.totalSteps = 2;
				$('#dialogflowModal').modal({"show":true});
				break;
			case 5:
				$scope.currentStep = 1;
				$scope.actualStep = $scope.currentStep;
				$scope.totalSteps = 2;
				$('#qnAModal').modal({"show":true});
				break;
		}
		$scope.steps = new Array($scope.totalSteps);
		for(var i = 0; i < $scope.steps.length; i++) {
			$scope.steps[i] = i+1;
		}
	}

	$scope.nextStep = function() {
		$scope.actualStep++;
	}

	$scope.goBack = function() {
		$scope.actualStep--;
	}

	$scope.selectProjectUser = function (userid) {
		ProjectService.getProjectUser(userid).then(
			function(res) { //SUCCESS
				$scope.projects = res.data;
				resizeProjects($scope.projects.length + 1);
				return true;
			}, function(err) { //ERROR
				messages.error(err.data.message?err.data.message:JSON.stringify(err.data));
				return false;
			}
		);
	};
		
	$scope.projectDashboard = function(p) {
		project.set(p);
		//Set index of project
		// window.qlikProjectActual = p.order;
		// loading.show();
		// if ($scope.user.groupId != '4'){
			$state.go('answer');
		// } else {
			// $state.go('session');
		// }
	}

	$scope.selectProject = function(p){
		if($scope.userinfo.statusAdmin) {
			$scope.go('new-bot');
			$scope.project = angular.copy(p);
			selectedProject = angular.copy(p);
			// $scope.selectNLP($scope.project['nlp']);
			// $('#projectModal').modal({"show":true});
		} else {
			messages.error('NO-PERMISSION');
		}
	}

	$scope.newBot = function() {
		bindFileRead.set(null);
		if($scope.userinfo.statusAdmin) {
			selectedProject = {}
			$scope.go('new-bot');
		} else {
			messages.error('NO-PERMISSION');
		}
	}

	$scope.removeProject = function(pid){
		if($scope.userinfo.statusAdmin) {
			confirmModal.show('PROJECT-REMOVE-TITLE', 'PROJECT-REMOVE-TEXT', function(){
				ProjectService.delete(pid).then(
					function(res) { //SUCCESS
						messages.success('PROJECT-REMOVE-SUCCESS');
						$scope.loadProjects();
						cacheCleanerService.clean();
						cacheCleanerService.cleanProjects();
					}, function(err) { //ERROR
						messages.error(err.data.message? err.data.message : JSON.stringify(err.data));
					}
				);
			});
		} else {
			messages.error('NO-PERMISSION');
		}
	}

	$scope.projectsPage = function() {
		project.clear();
		$scope.go("home");
	}

	$scope.saveProject = function() {
		var p = $scope.project;
		var pm = $scope.project.metadata;
		var pk = $scope.project.api_key;
		p.jsonmetadata = $scope.project["jsonmetadata"];

		$scope.projectError = {};
		var error = false;
		if($scope.isEnable) {
			if(!pk) {
				error = true;
				$scope.projectError.api_key = 'REQUIRED-FIELD';
			}
		}
		if(!$scope.isEnable) {
			$scope.project.api_key = '';
		}

		if (!p.name) {
			error = true;
			$scope.projectError.name = 'REQUIRED-FIELD';
		}
        if (!p.locale || p.locale == 'default' || p.locale == '') {
            error = true;
            $scope.projectError.locale = 'REQUIRED-FIELD';
		}
		if (!p['nlp'] || p.nlp=='') {
            error = true;
            $scope.projectError.nlp = 'REQUIRED-FIELD';
		} else {
			if (p.nlp==1) { //clever
				p.metadata = {
					cleverUrl: '',
					maxIntents: 5,
					modelName: p.name,
					modelVersion: '',
					env: "homolog",
					lang: p.locale
				}
				p.nlpName = 'Clever';
				p.clever = true;

			} else if (p.nlp==2) { //luis
				p.nlpName = 'Luis';
				var indexVerbose = pm.url.lastIndexOf('verbose');
				var indexKey = pm.url.lastIndexOf('subscription-key');
				var url = pm.url.split('/v2.0')[0];
				if(indexKey < indexVerbose) {
					var splitedData = pm.url.split('?subscription-key=');
					var workspaceId = splitedData[0].split('apps/')[1];
					var suscriptionKey = splitedData[1].split('&verbose=')[0];
				} else {
					var splitedData = pm.url.split('?verbose=');
					var workspaceId = splitedData[0].split('apps/')[1];
					var suscriptionKey = splitedData[1].split('&subscription-key=')[1].split('&')[0];
				}
				if (!pm || !suscriptionKey) {
					error = true;
					$scope.projectError.nlp = 'REQUIRED-FIELD';
					$scope.projectError.luisUrl = 'REQUIRED-FIELD';
				}
				if (!pm || !url) {
					error = true;
					$scope.projectError.nlp = 'REQUIRED-FIELD';
					$scope.projectError.luisUrl = 'REQUIRED-FIELD';
				}
				if (!pm || !workspaceId) {
					error = true;
					$scope.projectError.nlp = 'REQUIRED-FIELD';
					$scope.projectError.luisUrl = 'REQUIRED-FIELD';
				}
				p.metadata = {
					suscriptionKey: suscriptionKey,
					workspaceId: workspaceId,
					url: url
				}
			} else if (p.nlp==3) { //watson
				p.nlpName = 'Watson';
				if (!pm || !pm.workspaceUrl) {
					error = true;
					$scope.projectError.nlp = 'REQUIRED-FIELD';
					$scope.projectError.workspaceUrl = 'REQUIRED-FIELD';
				}
				if (!pm || !pm.workspaceUsername) {
					error = true;
					$scope.projectError.nlp = 'REQUIRED-FIELD';
					$scope.projectError.workspaceUsername = 'REQUIRED-FIELD';
				}
				if (!pm || !pm.workspacePassword) {
					error = true;
					$scope.projectError.nlp = 'REQUIRED-FIELD';
					$scope.projectError.workspacePassword = 'REQUIRED-FIELD';
				}
			} else if(p.nlp==4) {
				p.nlpName = 'DialogFlow';
				p.dialogflow = true;
				p.jsonmetadata = $scope.project["jsonmetadata"];
				if(p.jsonmetadata) {
					var json = JSON.parse(p.jsonmetadata);
					if(!json.type) {
						error = true;
						$scope.projectError.dialogflow = "REQUIRED-FIELD-CORRECT";
					}
				}
				
				if (null == $scope.project["jsonmetadata"] || undefined == $scope.project["jsonmetadata"] ) {
					error = true;
					$scope.projectError.nlp = 'REQUIRED-FIELD';
					$scope.projectError.dialogflow = 'REQUIRED-FIELD';
				} else {
					bindFileRead.set(null);
				}
			} else if (p.nlp==5) { //QnA
				p.nlpName = 'QnA Maker';
				if (!pm || !pm.qnaPost) {
					error = true;
					$scope.projectError.nlp = 'REQUIRED-FIELD';
					$scope.projectError.qnaPost = 'REQUIRED-FIELD';
				}
				if (!pm || !pm.qnaHost) {
					error = true;
					$scope.projectError.nlp = 'REQUIRED-FIELD';
					$scope.projectError.qnaHost = 'REQUIRED-FIELD';
				}
				if (!pm || !pm.qnaAuthorization) {
					error = true;
					$scope.projectError.nlp = 'REQUIRED-FIELD';
					$scope.projectError.qnaAuthorization = 'REQUIRED-FIELD';
				}
			}
		}
		if (error) {
			messages.error("EMPTY-FIELD");
			return;
		}
		$scope.hideButton = true;

		delete p.image;
		delete p.contentType;

		if (p.imageTemp && p.contentTypeTemp) {
			p.image = p.imageTemp;
			p.contentType = p.contentTypeTemp;
			delete p.imageTemp;
			delete p.contentTypeTemp;
		}

		var method = p.id ? 'PUT' : 'POST';
		var uri = '/cockpit/v1/projects' + (p.id ? '/'+p.id : '');
		$http({
				"method":method,
				"url":uri,
				"headers":{
				"Content-type":"application/json"
			},
			"data":p
		}).then(
			function(res) { //SUCCESS
				$scope.loadProjects();
				messages.success(p.id?"PROJECT-UPDATED":"PROJECT-CREATED");
				cacheCleanerService.clean();
				cacheCleanerService.cleanProjects();
				reloadPermission();
				afterCreateProject();
				$scope.go('home');
			}, function (err) { //ERROR
				console.log(err.data);
				messages.error(err.data['message'] ? err.data.message : JSON.stringify(err.data));
				afterCreateProject();
			}
		);
		
	};

	function afterCreateProject() {
		$scope.loadProjects();
		$scope.hideButton = false;
		$("#imageSelector").val("");
		$scope.project.image = "";
		$scope.nameImage = "";
	}

	var nlpModded = false;
	$scope.closeNlpModal = function() {
		if(projNlp !== $scope.project.nlp && angular.equals($scope.project.metadata, {})) {
			$scope.project.metadata = projMetadata[0];
		} else if(projNlp !== $scope.project.nlp && !angular.equals($scope.project.metadata, {})) {
			nlpModded = true;
		}
		if(angular.equals($scope.project.metadata, {})) { //checks if $scope.project.metadata is an empty object
			$scope.project.metadata = projMetadata;
		}
		$scope.fileNameErr = false;
		$('#cleverModal').modal("hide");
		$('#dialogflowModal').modal("hide");
		$('#luisModal').modal("hide");
		$('#watsonModal').modal("hide");
		$('#qnAModal').modal("hide");
	}

	$scope.getImage = function(e) {
		if (!e || !e.files || !e.files.length || !e.files[0].size)return;
		if (e.files[0].size <= 102400) {
			var reader = new FileReader();
			reader.onload = function(e){
				var project = reader.result;
				var size = project.indexOf(',')+1;
				$scope.project.imageTemp = project.substr(size);
				$scope.project.contentTypeTemp = project.substr(0,size);
				$scope.$apply();
			};
			reader.readAsDataURL(e.files[0]);
			$scope.nameImage = e.files[0].name;
			$scope.$apply();
		} else {
			$("#imageSelector").val("");
			$scope.project.image = "";
			$scope.project.contentType = "";
			$scope.nameImage = "";
			messages.warning("PROJECT-IMAGE-SIZE");
			return;
		}
	};

	$scope.getFile = function(e) {
		if (!e || !e.files || !e.files.length || !e.files[0].size)return;
		if (e.files[0].size <= 10000) {
			$scope.fileName = e.files[0].name;
			$scope.fileNameErr = false;
			$scope.$apply();
		} else {
			$("#imageSelector").val("");
			$scope.project.metadata = "";
			$scope.fileNameErr = true;
			return;
		}
	};

	$scope.loadProjects();

	$scope.openImageSelector = function(e) {
		e.preventDefault();
		e.stopPropagation();
		document.querySelector('#imageSelector').click();
	}

	$scope.openFileSelector = function(e) {
		e.preventDefault();
		e.stopPropagation();
		document.querySelector('#df-key-json').click();
	}

	$scope.switchEnable = () => {
		$scope.isEnable = !$scope.isEnable;
		// $scope.selectedIntent['enable'] = $scope.isEnable;
	}

	function reloadPermission() {
		userService.reloadPermission().then(
			function(res) {
				userInfo.set(res['data']);
			},
			function(err) {
				console.log(err);
			}
		)
	}

	function resizeProjects(n) {
		var prSize = 272;
		var pl = $('#projectsList');
		var sw = window.innerWidth-23;
		var num = typeof(n)=='number'?n:pl.children().length;
		var wid = num * prSize;
		if (wid > sw)
			wid = parseInt(sw / prSize) * prSize;
		pl.css('width', wid+'px');
	}
	
	$(window).resize( () => {
		if($scope.projects) {
			resizeProjects($scope.projects['length']+1);
		}
	});
	
});

app.directive("fileread", ['bindFileRead' ,function (bindFileRead) {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
						scope.fileread = loadEvent.target.result;
						// jsonFile = scope.fileread;
						bindFileRead.set(scope.fileread);
						
                    });
				}

				reader.readAsText(changeEvent.target.files[0]);
				
				
            });
        }
    }
}]);