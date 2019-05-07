/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/

// create the module and name it scotchApp 'base64',
var app = angular.module('cockpitApp', ['summernote', 'ui.codemirror', 'ui.router','pascalprecht.translate',
'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'directoryTree', 'isteven-multi-select', 'angular-loading-bar', 'ngAnimate'])
	.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    	cfpLoadingBarProvider.includeSpinner = false;
  	}]);


// app.factory('qlikLoading',function(vQlikTimeOut){
	
// });


// app.factory('project',function(){
// 	return {
// 		"get":function() {
// 			return this.project;
// 		},
// 		"set":function(p) {
// 			this.project = p;
// 		},
// 		"clear":function() {
// 			this.project = null;
// 		}
// 	};
// });

// app.factory('loading', function() {
// 	return {
// 		"setLoadingFn":function(fn) {
// 			this.loadingFn = fn;
// 		},
// 		"show":function() {
// 			// console.log('show');
// 			this.loadingFn(true);
// 		},
// 		"hide":function() {
// 			// console.log('hide');
// 			this.loadingFn(false);
// 		}
// 	};
// });

// app.factory('messages', function($interval, $filter) {
// 	var template = "<div class=\"cockpit-msg :TYPE:\" id=\":ID:\"><div class=\"row\">"+
// 		"<div class=\"col-sm-10\">:MESSAGE:</div><div class=\"col-sm-2\" style=\"text-align: right\">"+
// 		"<img src=\"/cockpit/img/close.svg\" style=\"cursor:pointer\" onclick=\"closeMessage(':ID:')\" /></div></div></div>";
// 	var service = {
// 		"msgIncr":0,
// 		"error":function(msg, delay) {
// 			this.addMessage('danger',msg, delay);
// 		},
// 		"success":function(msg, delay) {
// 			this.addMessage('success',msg, delay);
// 		},
// 		"warning":function(msg, delay) {
// 			this.addMessage('warning',msg, delay);
// 		},
// 		"addMessage":function(type,msg,delay) {
// 			var msgDiv = document.getElementById('generalMessages');
// 			if (!msgDiv) {
// 				msgDiv = document.createElement("div");
// 				msgDiv.id = "generalMessages";
// 				msgDiv.className = "gen-msg-area";
// 				document.getElementsByTagName("body")[0].appendChild(msgDiv);
// 			}
// 			var id = "message-id-" + this.msgIncr++;
// 			msg = $filter('translate')(msg);
// 			msgDiv.innerHTML += template.replace(':TYPE:', type).replace(':MESSAGE:', msg).replace(new RegExp(':ID:', 'g'), id);
// 			this.closeFn(id, delay);
// 		},
// 		"closeFn":function(id, delay) {
// 			if (!delay)delay = 10000;
// 			var stop = $interval(function() {
// 				var elem = $('#'+id);
// 				if (elem){
// 					elem.addClass('fadeout');
// 					$interval(function() {
// 						$('#'+id).remove();
// 					}, 500, 1);
// 				}
// 			}, delay, 1);
// 		}
// 	};
// 	return service;
// });
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

// app.factory('confirmModal', function() {
// 	var service = {};
// 	service.setBehaviour = function(fn) {
// 		this.behaviour = fn;
// 	};
// 	service.show = function(title,text,type,callback) {
// 		if (typeof(type) == 'function') {
// 			callback = type;
// 			type = 'remove';
// 		}
// 		$('#confirmModalBts').find('div').each(function(i) {
// 			var e = $(this);
// 			var t = e.attr('data-show-type') || e.attr('show-type');
// 			e.css('display', t == type ? 'block' : 'none');
// 		});
// 		this.behaviour(title,text,callback);
// 	};
// 	service.remove = function(title,text,callback) {
// 		service.show(title, text, 'remove', callback);
// 	};
// 	service.confirm = function(title,text,callback) {
// 		service.show(title, text, 'confirm', callback);
// 	};
// 	service.notify = function(title,text,callback) {
// 		service.show(title, text, 'notify', callback);
// 	};
// 	return service;
// });

// app.factory('leftBar', function($state, project, loading) {
// 	var service = {
// 		"options":[
// 		{
// 				"textKey":"LEFT-BAR-ARCHITECTURE",
// 				"img":"architecture",
// 				"imgSize":27,
// 				"page":"/architecture/",
// 				"children":[
// 					{
// 						"textKey":"MENU-ANSWER",
// 						"page":"answer"
// 					// },{
// 					// 	"textKey":"MENU-TEST",
// 					// 	"page":"/architecture/test"
// 					},{
// 						"textKey":"MENU-CHANNEL",
// 						"page":"channels"
// 					}
// 				]
// 			},
// 				{
// 				"textKey":"LEFT-BAR-DASHBOARD",
// 				"img":"dashboard",
// 				"imgSize":30,
// 				"page":"/dashboard/",
// 				"children":[
// 					{
// 						"textKey":"MENU-SESSIONS",
// 						"page":"session"
// 					},
// 					{
// 						"textKey":"MENU-ATTENDANCE",
// 						"page":"session-table"
// 					},
// 					{
// 						"textKey":"MENU-QUESTIONS",
// 						"page":"question"
// 					},
// 					{
// 						"textKey":"MENU-SATISFACTION",
// 						"page":"satisfaction"
// 					},
// 					{
// 						"textKey":"DOWNLOAD-MENU",
// 						"page":"download-page"
// 					}
// 				]
// 			},
// 				{
// 				"textKey":"LEFT-BAR-SAMPLE",
// 				"img":"sample",
// 				"imgSize":30,
// 				"page":"/sample/",
// 				"children":[
// 					{
// 						"textKey":"MENU-SAMPLE-REGISTER",
// 						"page":"sample-register"
// 					},
// 										{
// 						"textKey":"MENU-SAMPLE-SEARCH",
// 						"page":"sample-search"
// 					}
// 				]
// 			}
// 		],
// 		"getSelected":function() {
// 			for (i in this.options) {
// 				if (this.options[i].selected)
// 					return this.options[i];
// 			}
// 		},
// 		"showBarStatus": false,
// 		"hide":function() {
// 			this.showBarStatus = false;
// 		},
// 		"show":function(n) {
// 			if (!project.get())
// 				$state.go('home');
// 			this.showBarStatus = true;
// 			if (n) {
// 				for(i in service.options) {
// 					for (j in service.options[i].children) {
// 						var c = service.options[i].children[j];
// 						if (c.page === n) {
// 							service.options[i].select();
// 							c.select();
// 							break;
// 						}
// 					}
// 				}
// 			}
// 		},
// 		"toggle":function() {
// 			this.showBarStatus = !this.showBarStatus;
// 		},
// 		"isShow":function (){
// 			return this.showBarStatus;
// 		}
// 	};

// 	for (i in service.options) {
// 		var option = service.options[i];
// 		option.select = function(gt) {
// 			for (i in service.options) 
// 				service.options[i].selected = false;
// 			this.selected = true;
// 			//$state.go(this.page);
// 			if (this.children && this.children.length)
// 				this.children[0].select(gt);
// 		};
// 		option.getImage = function() {
// 			return this.img + (this.selected ? '-selected' : '');
// 		};
// 		for (j in option.children) {
// 			var child = option.children[j];
// 			child.parent = option;
// 			child.select = function(gt) {
// 				for (i in this.parent.children) 
// 					this.parent.children[i].selected = false;
// 				this.selected = true;
// 				if (gt){
// 					loading.show();
// 					$state.go(this.page);
// 				}
// 			};
// 		}
// 	}

// 	return service;
// });

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

	// 
	// var auth = $base64.encode("everis:everis123456");
	// $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + auth;
	// $httpProvider.defaults.withCredentials = true;
	// $httpProvider.defaults.useXDomain = true;
	// delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

// configure our routes
app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	$stateProvider
		// route for the project page
		.state({
			name: 'ura-page',
			url: '/',
			templateUrl : '/ura/pages/ura.html',
			controller  : 'uraCtrl'
		})	;
		$urlRouterProvider.otherwise(function($injector,$location){
			var $state = $injector.get("$state");
			$state.go('ura-page');
		});
});



app.config(function($translateProvider) {	
	$translateProvider.useStaticFilesLoader({
		prefix: '/cockpit/lang/',
		suffix: '.json'
	});

	$translateProvider.useSanitizeValueStrategy('escapeParameters');
	$translateProvider.preferredLanguage('pt');
});

app.controller('cockpitCtrl', function($scope, $http, $state,$translate, leftBar, confirmModal, messages, project, loading) {
	$scope.go = function(path) {
		console.log(path);
		$state.go(path);
	};

	var ctrl = this;
	ctrl.language = 'pt';
	ctrl.languages = ['en', 'pt', 'es'];
	$scope.langSelected = "brazil";
	$scope.langImgs = [
		{"lang":"pt","img":"brazil"},
		{"lang":"en","img":"united-states"},
		{"lang":"es","img":"spain"}
	];
	$scope.leftBar = leftBar;
	$scope.showLeftBar = function () {
		return leftBar.isShow();
	};

	$scope.projectName = function () {
		return project.get() ? project.get().name : '';
	}
	$scope.projectsPage = function() {
		project.clear();
		$scope.go("home");
	}

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

	//LOADING
	$scope.loading = false;
	loading.setLoadingFn(function(ld) {
		$scope.loading = ld;
	});
	$scope.showLoading = function() {
		$scope.loading = true;
	};

	//LOAD USER
	$http.get('/cockpit/v1/user').then(function(res){
		$scope.user = res.data;
	});











	














		
});

//-----------------------------------------CHAT--------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------

