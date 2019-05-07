/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

// create the module and name it scotchApp
var app = angular.module('cockpitApp',
	[
		'summernote',
		'ui.codemirror',
		'ui.router',
		'pascalprecht.translate',
		'ngAnimate',
		'ngSanitize',
		'ui.bootstrap',
		'directoryTree',
		'projectsList',
		'isteven-multi-select',
		'angular-loading-bar',
		'ngTagsInput',
		'angularUtils.directives.dirPagination',
		'dndLists'
	]).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
  	cfpLoadingBarProvider.includeSpinner = false;
}]);

function closeMessage(id) {
	var elem = $('#'+id);
	if (elem){
		elem.addClass('fadeout');
		var tid = window.setTimeout(function() {
			$('#'+id).remove();
			window.clearTimeout(tid);
		}, 500);
	}
}

app.config(['$httpProvider', function($httpProvider) {
	//initialize get if not there
	if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};
	}

	// Answer edited to include suggestions from comments
	// because previous version of code introduced browser-related errors

	// disable IE ajax request caching
	$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
	// extra
	$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
	$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);

// configure our routes
app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	$stateProvider
		// route for the project page
		.state({
			name: 'home',
			url: '/',
			templateUrl : '/cockpit/pages/projects.html',
			controller  : 'projectsCtrl'
		})
		.state({
			name: 'new-bot',
			url: '/new-bot',
			templateUrl: '/cockpit/pages/new-bot.html',
			controller: 'projectsCtrl'
		})
		.state({
			name: 'flow',
			url: '/flow',
			templateUrl : '/cockpit/pages/flow.html',
			controller  : 'flowCtrl'
		})
		.state({
			name: 'type-of-channels',
			url: '/type-of-channels',
			templateUrl : '/cockpit/pages/type-of-channel.html',
			controller  : 'type-of-channelCtrl'
		})
		.state({
			name: 'your-channel',
			url: '/your-channel',
			templateUrl : '/cockpit/pages/channels.html',
			controller  : 'channelsCtrl'
		})
		.state({
			name: 'settings',
			url: '/settings',
			templateUrl : '/cockpit/pages/settings.html',
			controller  : 'settingsCtrl'
		})
		.state({
			name: 'answer',
			url: '/answer',
			templateUrl : '/cockpit/pages/answer.html',
			controller  : 'answerCtrl'
		})
		//  .state({
		//  	name: 'intent',
		//  	url: '/intent',
		//  	templateUrl : '/cockpit/pages/intent.html',
		//  	controller  : 'intentCtrl'
		//  })
		 .state({
		 	name: 'entity',
		 	url: '/entity',
		 	templateUrl : '/cockpit/pages/entity.html',
		 	controller  : 'entityCtrl'
		 })
		 .state({
		 	name: 'train-pub',
		 	url: '/train-pub',
		 	templateUrl : '/cockpit/pages/train-pub.html',
		 	controller  : 'train-pubCtrl'
		 })
		.state({
			name: 'session',
			url: '/session',
			templateUrl : '/cockpit/pages/session.html',
			controller  : 'sessionCtrl'
		})
		.state({
			name: 'question',
			url: '/question',
			templateUrl : '/cockpit/pages/question.html',
			controller  : 'questionCtrl'
		})
		.state({
			name: 'satisfaction',
			url: '/satisfaction',
			templateUrl : '/cockpit/pages/satisfaction.html',
			controller  : 'satisfactionCtrl'
		})
		.state({
			name: 'session-table',
			url: '/session-table',
			templateUrl: '/cockpit/pages/session-table.html',
			controller: 'session-tableCtrl'
		})
		.state({
			name: 'download-page',
			url: '/download-page',
			templateUrl: '/cockpit/pages/download-page.html',
			controller: 'download-pageCtrl'
		})
		.state({
			name: 'sample-register',
			url: '/sample-register',
			templateUrl: '/cockpit/pages/sample-register.html',
			controller: 'sample-registerCtrl'
		})
		.state({
			name: 'sample-search',
			url: '/sample-search',
			templateUrl: '/cockpit/pages/sample-search.html',
			controller: 'sample-searchCtrl'
		})
		.state({
			name: 'automatization-history',
			url: '/automatization-history',
			templateUrl: '/cockpit/pages/automatization-history.html',
			controller: 'automatizationHistoryCtrl'
		})
		.state({
			name: 'automatization-execute',
			url: '/automatization-execute',
			templateUrl: '/cockpit/pages/automatization-execute.html',
			controller: 'automatizationExecuteCtrl'
		})
		.state({
			name: 'download-excel-test-automatization',
			url: '/download-excel-test-automatization',
			templateUrl: '/cockpit/pages/automatization-download.html',
			onEnter: function ($window) {
				$window.open('/cockpit/template/automatization.xlsx', '_self');
			}
		});
		$urlRouterProvider.otherwise(function($injector,$location){
			var $state = $injector.get("$state");
			$state.go('home');
		});
});



app.config(function($translateProvider) {
	$translateProvider.useStaticFilesLoader({
		prefix: '/cockpit/lang/',
		suffix: '.json'
	});

	$translateProvider.useSanitizeValueStrategy('escapeParameters');

	//SET PREFERRED LANGUAGE
	var preferredLanguageName = navigator.language || navigator.userLanguage;
	switch(preferredLanguageName) {
		case 'pt-BR':
			preferredLanguageName = 'pt';
			break;
		case 'en-US':
			preferredLanguageName = 'en';
			break;
		case 'es-ES':
			preferredLanguageName = 'es';
			break;
			case 'es':
			preferredLanguageName = 'es';
			break;
		default:
			preferredLanguageName = 'en';
			break;
	}
	
	$translateProvider.preferredLanguage(preferredLanguageName);

	//SET LANGUAGE TO QLIK USE
	window.qlikLanguageActual = preferredLanguageName;
});



app.service('qlikIframe', function($interval) {


	// SCRIPT LOADING REPORT
	this.loadScreenFrame = function(documentHTML, nameIframe, timeAppearFrame){
		console.log("nameIframe",nameIframe);
		var tim;

		documentHTML.getElementById(nameIframe).contentWindow.qlik_loadDashboard = false;
		documentHTML.getElementById(nameIframe).contentWindow.qlik_errorLoadDashboard = false;

		//SHOW QLIK DASHBOARDS
		function afterQlikLoad() {
			console.log('Qlik loaded');
			$('.imageLoading').css('display','none');
			$('.reportIframe').css('visibility','visible').attr('id','animationReport');
		}

		//CHECK IF QLIK LOADED
		function checkQlik() {
			//TRY-CATCH TO TREAT THE ERROR IF EXIT WITH NULL CONTENTWINDOW VAR.
			try {
				console.log('Status Qlik load = ', documentHTML.getElementById(nameIframe).contentWindow.qlik_loadDashboard);
				console.log('Status Qlik error = ', documentHTML.getElementById(nameIframe).contentWindow.qlik_errorLoadDashboard);
				if ( documentHTML.getElementById(nameIframe).contentWindow.qlik_loadDashboard ||   documentHTML.getElementById(nameIframe).contentWindow.qlik_errorLoadDashboard){
					$interval(afterQlikLoad, timeAppearFrame , 1);
				} else {
					$interval(checkQlik, 2000, 1);
				}
			}
			catch(err) {
				//clearInterval(tim);
			}
		};

		//CALL LOOP TO CHECK IF QLIK LOADED
		$interval(checkQlik, 2000, 1);
	}

});

app.controller('cockpitCtrl', function($scope, $http, $state, $translate, leftBar, confirmModal, confirmModalPublish, messages, loading, userInfo, headerProjectList) {

	$scope.go = function(path) {
		$state.go(path);
	};

	//control left bar

	$scope.isOpened = false;
	openFixed = false;

	$scope.toggleLeftBar = function() {
		$scope.isOpened = !$scope.isOpened;
		openFixed = $scope.isOpened;
	}

	$scope.mouseNav = function(open) {
		if (!openFixed) {
			$scope.isOpened = open;
		}
	}

	var ctrl = this;
	var browserLang = navigator.language || navigator.userLanguage;
	var language = '';

	console.log('lenguage: ', browserLang);

	switch(browserLang) {
		case 'pt-BR':
			language = 'pt';
			break;
		case 'en-US':
			language = 'en';
			break;
		case 'es-ES':
			language = 'es';
			break;
			case 'es':
			language = 'es';
			break;
		default:
			language = 'en';
			break;
	}

	$scope.langSelected = language;
	$scope.langImgs = [
		{"lang":"en","img":"en"},
		{"lang":"pt","img":"pt"},
		{"lang":"es","img":"es"}
	];

	$scope.leftBar = leftBar;
	$scope.showLeftBar = function () {
		return leftBar.isShow();
	};

	$scope.isSettings = function () {
		return $state.current.name == 'settings';
	}

	$scope.updateLanguage = function(lang,s) {
		if(lang)ctrl.language=lang;
		$translate.use(ctrl.language);
		for (i in $scope.langImgs) {
			var li = $scope.langImgs[i];
			if (li.lang == ctrl.language)
				$scope.langSelected = li.img;
		}

		//SET LANGUAGE TO QLIK USE
		window.qlikLanguageActual = ctrl.language;

		//VERIFY IF FUNCTION EXISTS TO CALL TRANSLATE IN QLIK
		typeof window.parent.listenChooseLanguage  == "function" ? window.parent.listenChooseLanguage() : false;

		$scope.reorderLangs();
	};


	$scope.reorderLangs = function() {
		var arr = [];
		for (i in $scope.langImgs) {
			var li = $scope.langImgs[i];
			if (li.lang == ctrl.language)
				arr.push(li);
		}
		for (i in $scope.langImgs) {
			var li = $scope.langImgs[i];
			if (li.lang != ctrl.language)
				arr.push(li);
		}
		$scope.langImgs = arr;
	};

	$scope.updateLanguage($scope.langSelected);

	//REMOVE MODAL
	$scope.removeTitle = '';
	$scope.removeText = '';
	$scope.removeCallback = function(){};
	$scope.confirmDialogFn = function(title,text,cb) {
		$scope.confirmModalTitle = title;
		$scope.confirmModalText = text;
		$scope.confirmModalCallback = cb?cb:function(){};
		$('#confirmModal').modal({show: 'true'});
	};
	confirmModal.setBehaviour($scope.confirmDialogFn);

	//PUBLISH TRAINING MODAL
	$scope.publishTitle = '';
	$scope.publishTextFirst = '';
	$scope.publishTextSecond = '';
	$scope.publishedVersion;
	$scope.publishVersion;
	$scope.publishCallback = function(){};
	$scope.confirmPublishDialogFn = function(title,textFirst, textSecond,publishedVersion, publishVersion,cb) {
		$scope.confirmModalPublishTitle = title;
		$scope.confirmModalPublishTextFirst = textFirst;
		$scope.confirmModalPublishTextSecond = textSecond;
		$scope.confirmModalPublishCallback = cb?cb:function(){};
		$scope.publishedVersion = publishedVersion;
		$scope.publishVersion = publishVersion;
		$('#confirmModalPublish').modal({show: 'true'});
	};
	confirmModalPublish.setBehaviour($scope.confirmPublishDialogFn);

	//LOADING
	$scope.loading = true;
	loading.setLoadingFn(function(ld) {
		$scope.loading = ld;
	});
	$scope.showLoading = function() {
		$scope.loading = true;
	};

	//LOAD USER
	$http.get('/cockpit/v1/user').then(function(res){
		$scope.user = res.data;
		$scope.cockpitUser = $scope.user;
		userInfo.set($scope.user);

		$scope.cockpitRoles = {
			any:function(arrRoles) {
				var c = $scope.cockpitUser;
				if (c.statusAdmin)return true;
				for(i in c.permissions) {
					for (j in arrRoles) {
						if (c.permissions[i] == arrRoles[j])
							return true;
					}
				}
				return false;
			},
			all:function(arrRoles) {
				var c = $scope.cockpitUser;
				if (c.statusAdmin)return true;
				for(i in c.permissions) {
					var ok = false;
					for (j in arrRoles) {
						if (c.permissions[i] == arrRoles[j])
							ok = true;
					}
					if (!ok) return false;
				}
				return true;
			},
			none:function(arrRoles) {
				var c = $scope.cockpitUser;
				if (c.statusAdmin)return true;
				for(i in c.permissions) {
					for (j in arrRoles) {
						if (c.permissions[i] == arrRoles[j])
							return false;
					}
				}
				return true;
			}
		};

		userInfo.set(res.data);

		//Set admin type to use in the Qlik
		window.qlikIsAdminUser = $scope.user.groupId;
		window.userDataQlik = $scope.user;
	});

	$scope.changePasswordError = {};
	$scope.changePassword = function() {
		var cpe = $scope.changePasswordError;
		var error = false;
		var data = {
			"id":$scope.user.id,
			"email":$scope.user.email,
			"oldPassword":$scope.currentPass,
			"newPassword":$scope.newPass,
			"validateNewPassword":$scope.repeatNewPass
		};

		var checkPass = $scope.newPass == $scope.repeatNewPass;
		var numbers = /[0-9]/;
        var letters = /[a-zA-Z]/;
        var characters = /[-!&_+@]/;
		var newPass = $scope.newPass;

		if(!$scope.newPass) {
			error = true;
			cpe.newPass = 'REQUIRED-FIELD';
		}
		if(!$scope.repeatNewPass) {
			error = true;
			cpe.repeatPass = 'REQUIRED-FIELD';
		}
		if(!$scope.currentPass) {
			error = true;
			cpe.currentPass = 'REQUIRED-FIELD';
		}

		if(error) {
			return;
		}
		
		if((letters.test(newPass) && numbers.test(newPass)
            || letters.test(newPass) && characters.test(newPass)
            || numbers.test(newPass) && characters.test(newPass))
            && checkPass) {
			$http.post('/cockpit/v1/users/changePassword',data).then(
				function(res) { //success
					messages.success(res.data['message']? res.data.message : 'Senha alterada com sucesso',10000);
					$('#userInfoModal').modal('hide');
				},
				function (err) { //error
					messages.error(err.data['message']? err.data.message : 'erro ao trocar senha',10000);
				}
			);
		} else if(!checkPass){
			messages.error('senhas não conferem',10000);
		} else if(!newPass || newPass.length<6){
			messages.error('NEW-PASSWORD-WRONG');
		} else if(!(letters.test(newPass) && numbers.test(newPass))
			|| !(letters.test(newPass) && characters.test(newPass))
			|| !(numbers.test(newPass) && characters.test(newPass))) {
			messages.error('senhas devem conter pelo menos duas das 3 regras requisitadas',10000);				
		}
	}

	$scope.toggleUserInfo = function () {
		if(!angular.equals($scope.changePasswordError.length, {})) $scope.changePasswordError = {};
		$('#userInfoModal').modal('show');
		$scope.msgSend = false;
	}

	$scope.dontScroll = false;
	$scope.$watch( function() {
		return headerProjectList.get();
	}, function(newValue, oldValue) {
		$scope.dontScroll = newValue;
	});
});
