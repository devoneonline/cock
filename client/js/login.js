/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

var app = angular.module("loginApp", ['pascalprecht.translate', 'vcRecaptcha']);

app.controller('loginCtrl', function($scope, $http, messages) {
	$scope.wrongEmail = false;
	$scope.wrongPassword = false;
	$scope.errorText = '';
	
	$scope.login = function(e){
		$scope.wrongEmail = false;
		$scope.wrongPassword = false;
		$scope.wrongEmail = !$scope.email || $scope.email.indexOf('@')<0;
		$scope.wrongPassword = !$scope.password;

		if ($scope.wrongPassword && $scope.wrongEmail)
			$scope.errorText = 'LOGIN-FIELDS-ERROR';
		else if ($scope.wrongEmail)
			$scope.errorText = 'LOGIN-EMAIL-ERROR';
		else if ($scope.wrongPassword)
			$scope.errorText = 'LOGIN-PASSWORD-ERROR';
		else
			$scope.doLogin();

		e.preventDefault();
	};

	
	$scope.doLogin = function() {
		var data = {
			"email":$scope.email,
			"password":$scope.password
		};
		$http.post('/login',data).then(
			//success
			function(res) {
				window.location.href = res.data == 'IVR' ? '/ura/' : '/cockpit/';
			},
			//error
			function (res) {
				$scope.errorText = res.data;
				$scope.wrongEmail = $scope.wrongPassword = true;
			}
		);
	}


	$scope.resetPassword = function (e) {
		if($scope.hasCaptcha) {
			var data = {
				"email": $scope.requestEmail,
				"g-recaptcha-response": $scope.verify.myRecaptchaResponse
			};
		} else {
			var data = {
				"email": $scope.requestEmail,
				"g-recaptcha-response": undefined
			};
		}
		$scope.loading = true;
		$http.post('/v1/send', data).then(
			function(res) {
				$scope.loading = false;
				$('#resetPassModal').modal('hide');
				messages.success(res.data['message']? res.data.message : 'Uma mensagem foi enviada para esse e-mail',10000);
			},
			function(err) {
				$scope.loading = false;
				messages.error(err.data['message']? err.data.message : 'E-mail não cadastrado',10000);
			}
		);
		e.preventDefault();
	}

	$scope.toggleResetPass = function () {
		$http.get('/v1/getsitekey').then(
			function(res) {
				res.data.sitekey == null || res.data.sitekey == '' ? $scope.hasCaptcha = false : $scope.hasCaptcha = true;
				$('#resetPassModal').modal('show');
			},
			function(err) {
				console.log('tchau');
				$scope.hasCaptcha = false;
				$('#resetPassModal').modal('show');
			}
		);
	}

	$scope.verifyCaptcha = function(e) {
		$scope.loading = true;
		console.log($scope.verify.myRecaptchaResponse);
		if($scope.verify == undefined) {
			messages.error('valide o captcha',10000);
			$scope.loading = false;
		} else {
			var data = {'data':$scope.verify.myRecaptchaResponse};
			$http.post('/recaptcha', data).then (
	
				function(successResponse) {
					if(successResponse.data.valid == true) {
						$scope.loading = false;

						$scope.resetPassword();
					} else {
						$scope.loading = false;
						messages.error('falha ao verificar captha',10000);
					}
				},
				function(err) {
					$scope.loading = false;
					messages.error('falha ao verificar captha',10000);
				}
			)
		}
		e.preventDefault();
	}
});


app.config(function($translateProvider) {	
	$translateProvider.useStaticFilesLoader({
		prefix: '/lang/',
		suffix: '.json'
	});

	var preferredLanguageName = navigator.language || navigator.userLanguage;
	
	// Some browsers have es-US or es-419 so I put the function includes 
	// to catch just the language spanish or english or portuguese
	
	if(preferredLanguageName.includes('pt')){
		preferredLanguageName = 'pt';
	}else{
		if(preferredLanguageName.includes('en')){
			preferredLanguageName = 'en';
		}else {
			if(preferredLanguageName.includes('es')){
				preferredLanguageName = 'es';
			}else{
				preferredLanguageName = 'en';
			}
		}
	}
	$translateProvider.preferredLanguage(preferredLanguageName);

	//SET LANGUAGE TO QLIK USE
	window.qlikLanguageActual = preferredLanguageName;
});