/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

var app = angular.module("cockpitApp");

app.controller('answerCtrl',function($scope, $http, $interval, leftBar, confirmModal, messages, project, loading, cacheCleanerService, AnswersService) {
	leftBar.show('answer');
	
	// Answer Modal:
	var uri = '';
	if (project.get()) {
		uri = '/cockpit/v1/answers/' + project.get().locale + '/' + project.get().id +'/export';
	}

	$scope.$watch(() => { return project.get(); }, function (newVal, oldVal) {
		if (typeof newVal !== 'undefined') {
			uri = '/cockpit/v1/answers/' + project.get().locale + '/' + project.get().id +'/export';
			loadEveryting();
		}
	});

	var summerOptions = [
		['fontname',['fontname']],
		['fontsize',['fontsize']],
		['style',['bold','italic','underline']],
		['color',['color']],
		['link',['link']],
		['paragraph',['paragraph']]
	];
    $scope.summerOptions = {
		height: 150,
		toolbar: summerOptions,
		dialogsInBody: true,
		disableDragAndDrop: true
    };
	
	$scope.parentDir = null;
	$scope.channelName = 'ALL';
	$scope.answer = {byChannel:{}};
	$scope.answerError = {};
	$scope.status = [];
	$scope.faqsFilter = [];
	$scope.codesFilter = [];
	$scope.textsFilter = [];

	$scope.abrir = function() {
		$('#answerModal').modal("show");
	}

	$scope.isChannelName = function(n) {
		return n == $scope.channelName;
	}

	$scope.isChannelClassification = function(c) {
		for (let i in $scope.channels) {
			var ch = $scope.channels[i];
			if (ch.name == $scope.channelName) {
				if (ch.classificationName == c)
					return true;
				return false;
			}
		}
		return false;
	}

	$scope.setChannelName = function(n) {
		$scope.channelName = n;
	}

	$scope.replaceChannelName = function(cn) {
		return cn.replace(/ /g,'-');
	}

	$scope.enableContent = function(cn) {
		if (!cn)cn = $scope.channelName;
		if ($scope.answer.byChannel[cn])
			$scope.answer.byChannel[cn].enabled = true;
		else{ 
			$scope.answer.byChannel[cn] = {
				"enabled":true,
				"answerType":"HTML",
				"techTextType":"javascript"
			};
		$scope.answer.byChannel[cn].enabled = true;
		}
		$('.channel-selector').find("div[id*='channel']").each(function(e){
			this.classList.remove('active-channel');
		});
		for(let channel in $scope.answer.byChannel){
			if($scope.answer.byChannel[channel].active === 1)
				$('#channel-'+ channel.replace(" ", "-")).addClass('active-channel');
			else{
				if($scope.answer.byChannel[channel].enabled === true)
					$('#channel-'+ channel.replace(" ", "-")).addClass('active-channel');
				else
					$('#channel-'+ channel.replace(" ", "-")).removeClass('active-channel');
			}
		}
		
	}

	$scope.disableContent = function() {
		var a = $scope.answer.byChannel[$scope.channelName];

		if ($scope.user.groupId == '3'){
			messages.error("NO-PERMISSION");
			return;
		}

		if (a.id) {
			$scope.answer.byChannel[$scope.channelName].enabled = false;
		} else {
			$scope.answer.byChannel[$scope.channelName].enabled = false;
			delete $scope.answer.byChannel[$scope.channelName];
		}
		$('#channel-'+ $scope.channelName.replace(" ", "-")).removeClass('active-channel');
	}
	$scope.isChannelEnabled = function(n) {
		if($scope.answer['byChannel']){
			return $scope.answer.byChannel[n] && $scope.answer.byChannel[n].enabled?true:false;
		}
		return;
	}
	$scope.getChannelId = function(n) {
		for (i in $scope.channels) {
			var c = $scope.channels[i];
			if (n == c.systemName)
				return c.id;
		}
		return null;
	}

	$scope.cmOptions = {
		lineNumbers: true,
		tabMode: "indent",
		onLoad: function(_cm) {
			$scope._cm = _cm;
			$scope.changeMode = function(_m) {
				_cm.setOption('mode', _m);
				$scope.answer.byChannel[$scope.channelName].techTextType = _m;
			}
		}
	};
	var isFirstTT = true;
	$scope.showHideTechText = function() {
		$scope.openTechText=!$scope.openTechText;
		if (isFirstTT) {
			isFirstTT = false;
			$interval(function(){$scope._cm.refresh();},500,1);
		}
	}

	$scope.loadStatus = function() {
		AnswersService.getStatus().then(
			(res) => { //SUCCESS
				$scope.status = res.data;
			},
			(err) => { //ERROR
				console.log(err);
				messages.error('ANSWER-LOAD-STATUS-ERROR');
			}
		);
	}
	
	$scope.loadChannels = function () {
		if (project.get() && project.get().id) {
			AnswersService.getChannels(project.get().id).then(
				(res) => { //SUCCESS
					$scope.channels = res.data;
					loading.hide();
					if(!$scope.channels.length) {
						$scope.go('type-of-channels');
						leftBar.show('channels');
					}
				},
				(err) => { //ERROR
					console.log(err);
					messages.error(JSON.stringify(err['data']));
				}
			);
		}
	}

	$scope.refreshOptionOrder = function(a,b,c){
		var opts = $scope.answer.byChannel[$scope.channelName].options;
		for(i in opts){
			opts[i].optionOrder = parseInt(i) + 1;
		}
	}

	$scope.saveAnswer = function() {
		$scope.answer.likeable = $scope.isLikeable;
		$scope.answer.transactional = $scope.isTransactional;
		$scope.answerError = {};
		var a = $scope.answer;
		var ae = $scope.answerError;
		var error = false;
		var characterValidation = /[^\a-zA-Zá-úÁ-Ú0-9(\)\-\_ ]/g;

		if (!a.code) {
			error = true;
			ae.code = 'REQUIRED-FIELD';
		}
		if (!a.title) {
			error = true;
			ae.title = 'REQUIRED-FIELD';
		}
		if (!a.locale) {
			error = true;
			ae.locale = 'REQUIRED-FIELD';
		}
		if (!a.projectId) {
			error = true;
			ae.projectId = 'REQUIRED-FIELD';
		}
		if (!a.type) {
			error = true;
			ae.type = 'REQUIRED-FIELD';
		}
		if (!a.statusId) {
			error = true;
			ae.statusId = 'REQUIRED-FIELD';
		}
		if (!a.directoryId) {
			error = true;
			ae.directoryId = 'REQUIRED-FIELD';
		}
		if(characterValidation.test(a.code)) {
			error = true;
			ae.characterValidation = "{{'CHARACTER-VALIDATION' | translate}}"
		}
		
		if ($scope.user.groupId == '3'){
			error = true;
			messages.error("NO-PERMISSION");
		}		

		for (i in a.byChannel) {
			var ac = a.byChannel[i];
			if (ac.answerType == 'HTML') {
				ac.text = ac.html;
			}
			if (!ac.text) {
				error = true;
				ae.text = 'REQUIRED-FIELD';
				ae.html = 'REQUIRED-FIELD';
			}
			for (i in ac.options) {
				var o = ac.options[i];
				o.error = {};

				if (!o.title){
					error = true;
					o.error.title = 'REQUIRED-FIELD';
				}

				if (!o.action) {
					o.textType = 'HTML';
					if (o.textType == 'HTML') {
						o.text = o.html;
					}
					if (!o.text) {
						error = true;
						o.error.text = 'REQUIRED-FIELD';
						o.error.html = 'REQUIRED-FIELD';
					}
				}
				if (o.action) {
					if (!o.text) {
						error = true;
						o.error.text = 'REQUIRED-FIELD';
					}
				}
			}
			if (ac['options']) {
				for(var i=0; i<ac.options.length; i++){
					for(var j=i+1; j<ac.options.length; j++){
						if(ac.options[i].ivrOption == ac.options[j].ivrOption){
							messages.error("SAME-IVR-OPTION");
							return;
						}
					}			
				}
			}
		}
		
		if (error) {
			messages.error("EMPTY-FIELD");
			return;
		}

		a = angular.copy(a);
		var alist = [];
		for (i in a.byChannel) {
			var answerChannel = a.byChannel[i];
			if (answerChannel.answerType == 'HTML') {
				answerChannel.text = answerChannel.html;
			}
			delete answerChannel.html;
			answerChannel.channelId = $scope.getChannelId(i);
			answerChannel.title = a.title;
			answerChannel.code = a.code;
			answerChannel.locale = a.locale;
			answerChannel.type = a.type;
			answerChannel.statusId = a.statusId;
			answerChannel.directoryId = a.directoryId;
			answerChannel.projectId = a.projectId;
			answerChannel.transactional = a.transactional; //LIKEABLE
			answerChannel.likeable = a.likeable; //LIKEABLE

			if (answerChannel.likeable === undefined || answerChannel.likeable === null) { //LIKEABLE
				answerChannel.likeable = false;
			} else {
				answerChannel.likeable = a.likeable;
			};					//LIKEABLE

			alist.push(answerChannel);
			
			var count = answerChannel.options ? answerChannel.options.length : 0;
			
			for (i in answerChannel.options) {
				var o = answerChannel.options[i];
				delete o.opened;
				
				o.answerId = answerChannel.id;
				o.locale = answerChannel.locale;

				if(o.removed) count--;
			}

			answerChannel.optionsMapping = count > 0;

		}
		
		$scope.savingAnswer = true;
		$http({
			"method": 'POST',
			"url": '/cockpit/v1/answers',
			"headers": {
				"Content-type":"application/json"
			},
			"data": alist
		}).then(
			//SUCCESS
			function(res) {
				messages.success("ANSWER-CREATED");
				$('#answerModal').modal('hide');
				$scope.loadDirectories($scope.parentDir);
				$scope.savingAnswer = false;
				$scope.answerError = {};
				$scope.answer = {};
				cacheCleanerService.clean();
			},
			//ERROR
			function(res) {
				messages.error(res.data['message'] ? res.data.message : JSON.stringify(res.data));
				$scope.savingAnswer = false;
			}
		);
	}

	$scope.addOption = function() {
		var a = $scope.answer.byChannel[$scope.channelName];
		var qtd = a.options ? a.options.length+1 : 1;
		for (i in a.options) {
			if (a.options[i].removed)
				qtd--;
		}

		if (!a.options)a.options = [];
		if (qtd > 10) {
			messages.warning("ANSWER-MAX-OPTIONS");
			return;
		}
		var opt = {
			"title":'',
			"textType":"HTML",
			"textTypeAction":"WATSON",
			"optionOrder":qtd,
			"ivrOption": (qtd == 10 ? 0 : qtd),
			"error":{}
		};

		a.options.push(opt);
		$scope.openOption(opt);
	};

	$scope.openOption = function(o) {
		if (!o.opened)
			for(i in $scope.answer.byChannel[$scope.channelName].options)$scope.answer.byChannel[$scope.channelName].options[i].opened=false;
		o.opened = !o.opened;
	};

	$scope.loadDirectories = function(dir) {
		if (dir) $scope.parentDir = dir;
		if (project.get() && project.get().id) {
			$http.get('/cockpit/v1/answers/' + project.get().id + '/directories/'+(dir ? dir.id + '/load-content' : '')).then(
				function(res) { //SUCCESS
					if (dir) {
						dir.children = res.data.directories;
						dir.children.push.apply(res.data.directories, res.data.answers);
						for(i in dir.children) {
							var item = dir.children[i];
							if (item.title) {
								item.isContent = true;
							} else {
								item.isDirectory = true;
							}
						}
					} else {
						$scope.directories = res.data;
						for(i in $scope.directories) {
							var item = $scope.directories[i];
							item.isDirectory = true;
						}
					}
				},
				function(res) { //ERROR
					if (dir)dir.openOnce = false;
					messages.error('ANSWER-LOAD-DIRECTORY-ERROR');
				}
			);
		}
	}

	$scope.selectItem = function(item) {
		if (item.title)
			$scope.selectAnswer(item);
		else
			$scope.selectDirectory(item);
	}
	$scope.selectDirectory = function(d){
		if (!d.parentId)$scope.parentDir=null;
		$scope.directory = angular.copy(d);
		$('#directoryModal').modal("show");
	}

	$scope.selectAnswer = function(a) {
		$http.get("/cockpit/v1/answers/"+ project.get().locale +"/"+a.code+"/projects/"+project.get().id).then(
			//SUCCESS
			function (res) {
				var answers = res.data;
				$scope.answer = {
					"title":answers[0].title,
					"code":answers[0].code,
					"statusId":answers[0].statusId+'',
					"type":answers[0].type,
					"directoryId":answers[0].directoryId,
					"projectId":answers[0].projectId,
					"locale":project.get().locale,
					"enabled":answers[0].active,
					"likeable":(answers[0].likeable? true:false),
					"byChannel":{}
				}
				$scope.isTransactional = answers[0].transactional;
				$scope.isLikeable = answers[0].likeable;
				$('.channel-selector').find("div[id*='channel']").each(function(e){
					this.classList.remove('active-channel');
				});
				for(i in answers) {
					var a = answers[i];
					//a.enabled = true;
					
					if (!a.channelId) {
						$scope.answer.byChannel['ALL'] = a;
						// $('#channel-ALL').addClass('active-channel');
						//$scope.enableContent('ALL');
					} else {
						for (let j in $scope.channels) {
							var c = $scope.channels[j];
							if (c.id == a.channelId) {
								$scope.answer.byChannel[c.systemName] = a;
								
								//$scope.enableContent(c.name);
								break;
							}
						}
					}

					a.answerType = /<[a-z][\s\S]*>/i.test(a.text) ? 'HTML' : 'TEXT';
					for (j in a.options) {
						a.options[j].textType = /<[a-z][\s\S]*>/i.test(a.options[j].text) ? 'HTML' : 'TEXT';
						a.options[j].html = a.options[j].text;
						a.options[j].error = {};
					}
					a.html = a.text;
					answers[i].enabled = answers[i].active;
				}

				for(channel in $scope.answer.byChannel){
					if($scope.answer.byChannel[channel].active === 1)
						$('#channel-'+ channel.replace(" ", "-")).addClass('active-channel');
					else
						$('#channel-'+ channel.replace(" ", "-")).removeClass('active-channel');
				}
				
				$scope.answerError = {};
				$('#answerModal').modal("show");
			},
			//ERROR
			function(res) {
				messages.error(JSON.stringify(res.data));
			}
		);
	}
	$scope.createDirectory = function(dir) {
		$scope.parentDir = dir;
		$scope.selectDirectory({
			'parentId':dir.id
		});
	}

	 $scope.saveDirectory = function() {
        $scope.directoryError = {};
        var d = $scope.directory;
        var de = $scope.directoryError;
        var error = false;
        
        if (!d.name) {
            error = true;
            de.name = 'REQUIRED-FIELD';
		}
		
		
		if ($scope.user.groupId == '3'){
			error = true;
			messages.error("NO-PERMISSION");
		}

        if (error) return;

		$scope.savingDir = true;
        var method = d.id ? 'PUT' : 'POST';
        var uri = '/cockpit/v1/answers/' + project.get().id + '/directories' + (d.id ? '/'+d.id : '');
        $http({
            "method":method,
            "url":uri,
            "headers":{
                "Content-type":"application/json"
            },
            "data":d
        }).then(
            //SUCCESS
            function(res) {
                messages.success(d.id?"DIRECTORY-ALERT-ALTER-SUCCESS":"DIRECTORY-ALERT-INSERT-SUCCESS",3000);
                $scope.loadDirectories($scope.parentDir);
                $('#directoryModal').modal("hide");
				$scope.savingDir = false;
            },
            //ERROR
            function (res) {
                messages.error(res.data.message ? res.data.message : JSON.stringify(res.data));
                $scope.loadDirectories($scope.parentDir);
                $('#directoryModal').modal("hide");
				$scope.savingDir = false;
            }
        );
    };

	$scope.removeNode = function(item,parent) {
		if (item.name)$scope.removeDirectory(item,parent);
		else  $scope.removeAnswer(item,parent);
	}
	$scope.removeAnswer = function(a,parent) {
		if(!a||!a.code)return;
		confirmModal.show('ANSWER-REMOVE-TITLE', 'ANSWER-REMOVE-TEXT', function(){
			AnswersService.delete(project.get().locale, a.code, project.get().id).then(
				(res) => { //SUCCESS
					messages.success('ANSWER-REMOVE-SUCCESS');
					$scope.loadDirectories(parent);
					cacheCleanerService.clean();
				}, (err) => {
					messages.error(err.data['message']? err.data.message:JSON.stringify(err.data));
				}
			);
		});
	}
	$scope.removeDirectory = function(dir,parent){
		if (!dir||!dir.id)return;

		if ($scope.user.groupId == '3'){
			messages.error("NO-PERMISSION");
			return;
		}
		
		confirmModal.show('DIRECTORY-REMOVE-TITLE', 'DIRECTORY-REMOVE-TEXT',function(){
			$http.delete('/cockpit/v1/answers/' + project.get().id + '/directories/'+dir.id).then(
				//SUCCESS
				function(res) {
					messages.success('DIRECTORY-REMOVE-SUCCESS');
					$scope.loadDirectories(parent);
				},
				//ERROR
					function(res) {
					messages.error(res.data.message?res.data.message:JSON.stringify(res.data));
				}
			);
		});
	}

	$scope.createAnswer = function(item) {
		$scope.channelName = "ALL";
		$scope.parentDir = item; 
		$scope.answer = {
			"title":"",
			"code":"",
			"statusId":"",
			"locale":project.get().locale,
			"type":"PRE",
			"byChannel":{
				"ALL":{
					"answerType":"HTML",
					"techTextType":"javascript"
				}
			},
			"directoryId":item.id,
			"projectId":project.get().id
		};
		$scope.enableContent('ALL');
		$('#answerModal').modal('show');
	}

	$scope.removeOption = function(opt) {
		var a = $scope.answer.byChannel[$scope.channelName];
		opt.removed = true;
		if (a.options.length > opt.optionOrder) {
			for(var i = opt.optionOrder - 1; i < a.options.length - 1; i++) {
				a.options[i].optionOrder--;
			}
		}
	}

	$scope.filter = {};
	$scope.loadAnswerFaqFilter = function() {
		var t = $scope.filter.title;
		if (!t)return;
		t = t.trim();
		if(t.length < 3)return;
		$http.post('/cockpit/v1/answers/select-distinct-faq-name/'+project.get().id, {
			"title":$scope.filter.title
		}).then(
			//SUCCESS
			function(res) {
				$scope.faqsFilter = res.data;
			},
			//ERROR
			function(res) {
				messages.error('ERROR');
			}
		);
	}
	$scope.loadAnswerCodeFilter = function() {
		var t = $scope.filter.code;
		if (!t)return;
		t = t.trim();
		if(t.length < 3)return;
		$http.post('/cockpit/v1/answers/select-distinct-code/'+project.get().id, {
			"code":$scope.filter.code
		}).then(
			//SUCCESS
			function(res) {
				$scope.codesFilter = res.data;
			},
			//ERROR
			function(res) {
				messages.error('ERROR');
			}
		);
	}

	$scope.cleanSearch = function() {
		$scope.isSearch = false;
		$scope.filter = {};
		$scope.loadDirectories();
	}
	$scope.isSearch = false;
	$scope.searchFilter = function() {
		var f = $scope.filter;
		if (!f || !f.title && !f.text && !f.code && !f.activeGroup) return;
		 $http.post('/cockpit/v1/answers/search/'+project.get().id, f).then(
			//SUCCESS
			function(res) {
				$scope.searchResults = res.data;
				$scope.isSearch = true;
			},
			//ERROR
			function(res) {
				messages.error('ERROR');
			}
		);
	}

	$scope.exportAnswers = function(){
		window.location.href = uri;
	}

	$scope.activeGroupNode = function(item,parent){
		if ($scope.user.groupId == '3'){
			messages.error("NO-PERMISSION");
			return;
		}
		$http.post('/cockpit/v1/answers/'+project.get().id+'/'+item.code, item).then(
			(res) => { //SUCCESS
				item.activeGroup = !item.activeGroup;
			},
			(err) => { //ERROR
				messages.error('ERROR');
			}
		);
	}

	function loadEveryting() {
		$scope.loadDirectories();
		$scope.loadStatus();
		$scope.loadChannels();
	}

	loadEveryting();

	$scope.switchLikeable = function() {
		$scope.isLikeable = !$scope.isLikeable;
	}
	$scope.switchTransactional = function() {
		$scope.isTransactional = !$scope.isTransactional;
	}
});