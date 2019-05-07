/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/  

var app = angular.module("cockpitApp");

app.controller('flowCtrl',function($scope, $http, $state,$interval,leftBar,confirmModal,messages,project,loading) {
	leftBar.show();
	$scope.evaJson = [];
	$scope.codesAndTitles = [];
	$scope.selectedNode = false;
	
	$scope.loadProject = function() {
		if (project.get()) {
			$http.get('/cockpit/v1/projects/select-by-id/'+project.get().id).then(
				//SUCCESS
				function(res) {
					$scope.evaJson = JSON.parse(res.data.dialogTree);
					$scope.createMindmap();
					loading.hide();
				},
				//ERROR
				function(res) {
					console.log(res.data);
					messages.error('Erro ao carregar fluxo de conversação');
				}
			);
		}
	};
	
	var findTitle = function(code){
		for(i in $scope.codesAndTitles) {
			var n = $scope.codesAndTitles[i];
			if (n.code == code)
				return n;
		}
	};
	
	$scope.createMindmap = function () {
		var rn = {
			id:'rootNode',
			//label:'Inicio da conversa',
			shape:'dot',
			color:{
				background:'#015373',
				border:'#015373',
				highlight:'#001B33'
			},
			font:{
				color:'white'
			},
			//borderWidth:20,
			level:0
		};
		var nodes = [rn];
		var edges = [];
		function doNodes(ns, parent, l){
			for (i in ns) {
				var n = ns[i];
				nodes[nodes.length] = n;
				n.level = l;
				if (!n.label) {
					var ans = findTitle(n.answerCode);
					if (n.answerCode)
						// n.label = findTitle(n.answerCode).title;
						n['label'] = ans? ans['title'] : n['expression'];
					else if (n.jumpTo)
						n['label'] = 'Redirecionamento >> ' + n.jumpTo.node;
					else
						n['label'] = n.expression;
				}
				n['label'] = n.id + ". " + n['label'];
				if (parent) {
					edges[edges.length] = {from: parent.id, to: n.id, arrows:'middle'};
				}
				if (n.expression.indexOf('#') == 0) {
					n.color = {
						border:'#CF53A7',
						background:'#CF53A7',
						highlight:'#A81B6D'
					};
				} else if (n.expression.indexOf('@') == 0) {
					n.color = {
							border:'#00B59C',
							background:'#00B59C',
							highlight:'#00805F'
						};
					} else if (n.expression == 'default' || n.expression == 'true') {
						n.color = {
								border:'#F6C924',
								background:'#F6C924',
								highlight:'#D1A914'
							};
						}
				/*if (n.jumpTo && n.jumpTo.node) {
					edges[edges.length] = {
							from: n.id, 
							to: n.jumpTo.node, 
							dashes: true, 
							label: (n.jumpTo.type == 'WAIT_INPUT' ? 'Aguardar usuário' : (n.jumpTo.type == 'RESPOND' ? 'Ir para resposta' : 'Avaliar condição')), 
							arrows:'to', 
							smooth:{
								type:'curvedCW',
								roundness:0.2,
								enabled:true,
								forceDirection:'vertical'
							}
					};
				}*/
				if (n.children)
					doNodes(n.children, n, l+1);
			}
		};
		doNodes($scope.evaJson, rn, 1);
		
		// create a network
		var container = document.getElementById('conversationFlow');
	
		// provide the data in the vis format
		var data = {
			nodes: nodes,
			edges: edges,
		};
		var options = {
			/* physics: {
				enabled: true,
				maxVelocity: 5,
				solver:'forceAtlas2Based'
			}, */
			height:'100%',
			nodes: {
				shape:'box',
				color:{
					background:'#CC8F4C',
					border:'#CC8F4C',
					highlight:'#8D5618'
				},
				font:{
					color:'white'
				},
				//fixed:true
			} ,
			layout: {
				hierarchical: {
					direction: 'LR',
					levelSeparation: 250
				}
			}
		};
	
		// initialize your network!
		console.log('creating VIS!');
		var network = new vis.Network(container, data, options);
		network.on("click", function(params){
			var ns = params.nodes;
			if (!ns || !ns.length) {
				$scope.selectedNode = false;
				document.getElementById('fakeBT').click();
				return;
			}
			
			var node = $scope.getNode($scope.evaJson, ns[0]);
//			if (!node.answerCode) {
//				if (node.jumpTo && node.jumpTo.type == 'RESPOND') {
//					messages.warning('Nó desvia fluxo de conversa para o nó ' + $scope.getNode($scope.evaJson, node.jumpTo.node).label);
//				}
//				return;
//			}
			//$scope.showInfo(node);
			//$scope.selectAnswer(node.answerCode);
			$scope.selectedNode = node;
			document.getElementById('fakeBT').click();
		});
	}
	
	$scope.showInfo = function() {
//		$scope.selectedNode = node;
		var node = $scope.selectedNode;
		var lb = node.jumpTo ? $scope.getNode($scope.evaJson, node.jumpTo.node).label : '';
		
		node.jumpToType = node.jumpTo ? (node.jumpTo.type == 'RESPOND' ? 'Pular para resposta '+lb : 
			(node.jumpTo.type == 'CONDITION' ? 'Pular e validar condição de '+lb : 'Pular fluxo para '+lb+' e aguardar usuário')) : 'N/A';
	};
	
	$scope.getNode = function(nodes, id) {
		for (i in nodes) {
			var n = nodes[i];
			if (n.id == id)
				return n;
			if (n.children) {
				var x = $scope.getNode(n.children, id);
				if (x)
					return x;
			}
		}
		return false;
	};

	$scope.loadStatus = function() {
		$http.get('/cockpit/v1/answers/status').then(
			//SUCCESS
			function(res) {
				$scope.status = res.data;
			},
			//ERROR
			function(res) {
				console.log(res.data);
				messages.error('ANSWER-LOAD-STATUS-ERROR');
			}
		);
	}
	
	$scope.loadChannels = function () {
		$http.get('/cockpit/v1/projects/'+project.get().id+'/channels').then(
			//SUCCESS
			function(res) {
				$scope.channels = res.data;
				loading.hide();
			},
			//ERROR
			function(res) {
				console.log(res.data);
				messages.error(JSON.stringify(res.data));
			}
		);
	}
	
	$scope.loadCodesAndTitles = function () {
		$http.get('/cockpit/v1/answers/codes-titles').then(
			//SUCCESS
			function(res) {
				$scope.codesAndTitles = res.data;
			},
			//ERROR
			function(res) {
				console.log(res.data);
				messages.error(JSON.stringify(res.data));
			}
		);
	}

	$scope.abrir = function() {
		$('#answerModal').modal("show");
	}
	
	$scope.selectAnswer = function(code) {
		$http.get("/cockpit/v1/answers/"+ project.get().locale +"/"+code+"/projects/"+project.get().id).then(
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
					"byChannel":{}
				}
				$('.channel-selector').find("div[id*='channel']").each(function(e){
					console.log("teste" + this);
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
						for (j in $scope.channels) {
							var c = $scope.channels[j];
							if (c.id == a.channelId) {
								$scope.answer.byChannel[c.name] = a;
								
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
				console.log(res.data);
				messages.error(JSON.stringify(res.data));
			}
		);
	};
	
	$scope.loadProject();
	$scope.loadStatus();
	$scope.loadChannels();
	$scope.loadCodesAndTitles();
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//ANSWER
	
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
		dialogsInBody: true
    };
	
	$scope.parentDir = null;
	$scope.channelName = 'ALL';

	$scope.answer = {byChannel:{}};
	$scope.answerError = {};
	$scope.status = [];
	
	
	$scope.isChannelName = function(n) {
		return n == $scope.channelName;
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
			console.log("teste" + this);
			this.classList.remove('active-channel');
		});
		for(channel in $scope.answer.byChannel){
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
		return $scope.answer.byChannel[n] && $scope.answer.byChannel[n].enabled?true:false;
	}
	$scope.getChannelId = function(n) {
		for (i in $scope.channels) {
			var c = $scope.channels[i];
			if (n == c.name)
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
});
