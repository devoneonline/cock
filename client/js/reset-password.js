/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

var app = angular.module("loginApp", ['pascalprecht.translate']);

app.controller('resetCtrl', function($scope,$http,$window, messages) {

	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, '\\$&');
		var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	var token = getParameterByName('token');

	$http.get('/v1/validate-token/'+token).then(
		function(res) {
			console.log(res);
			if(res.data=="true") {
				$scope.validToken = true;
				console.log('valido');
			} else {
				$scope.validToken = false;
				console.log('invalido');
				console.log(res);
			}
		},
		function(err) {
			$scope.validToken = false;
			console.log('erro');
		}
	)

	$scope.resetPassword = function () {
        console.log($scope.newPass);
        var checkPass = $scope.newPass == $scope.confirmPass;
        var numbers = /[0-9]/;
        var letters = /[a-zA-Z]/;
        var characters = /[-!&_+@]/;
		var newPass = $scope.newPass;
		var data = {
			"token": token,
			"pass": $scope.newPass,
			"passConfirm": $scope.confirmPass
		}

        if((letters.test(newPass) && numbers.test(newPass)
            || letters.test(newPass) && characters.test(newPass)
            || numbers.test(newPass) && characters.test(newPass))
            && checkPass) {
			$http.post('/v1/changePassword', data).then(
				function(res) {
					$scope.resetPassSuccess = true;
				},
				function(err) {
					messages.error(err.data['message']? err.data.message : 'erro ao trocar senha',10000);
				}
			)
        } else if(!checkPass){
			messages.error('senhas não conferem',10000);
		} else if(newPass.length<6){
			messages.error('senha deve ter no mínimo 6 caracteres',10000);
		} else if(!(letters.test(newPass) && numbers.test(newPass))
			|| !(letters.test(newPass) && characters.test(newPass))
			|| !(numbers.test(newPass) && characters.test(newPass))) {
			messages.error('senhas devem conter pelo menos duas das 3 regras requisitadas',10000);				
		}
	}

	$scope.redirectLogin = function () {
		$window.location.href = '/';
	}
});

app.config(function($translateProvider) {	
	$translateProvider.useStaticFilesLoader({
		prefix: '/lang/',
		suffix: '.json'
	});

	$translateProvider.useSanitizeValueStrategy('escapeParameters');
	$translateProvider.preferredLanguage('pt');
});