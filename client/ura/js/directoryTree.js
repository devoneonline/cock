/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/
(function() {
	'use strict';

	angular.module('directoryTree',[])
		.directive('directoryTree', directoryTreeDirective);

	directoryTreeDirective.$inject = [];
	function directoryTreeDirective() {
		var html = '<div class="directory-area" ng-repeat="item in items">'+
						'<table cellspacing="0" cellpadding="0" style="width:100%"><tr>'+
							'<td ng-if="cs" width="76"></td>'+
							'<td ng-if="cs" width="28">'+
								'<div class="directory-tree-top-spacer"></div>'+
								'<div class="directory-tree-bottom-spacer" ng-class="{\'last\':$last}"></div>'+
							'</td>'+
							'<td>'+
							
								//DIRECTORY
								'<div ng-if="item.isDirectory" class="directory-tree-box" ng-class="{\'item-opened\':item.opened,\'item-closed\':!item.opened}">'+
									'<div class="directory-tree-name" ng-click="openNode(item);">{{item.name}}</div>'+
									'<div class="directory-tree-buttons">'+
										'<img src="/cockpit/img/pencil.svg" ng-click="editNode(item)" height="30"/>'+
										'<img src="/cockpit/img/trash.svg" ng-click="removeNode(item)" height="30"/>'+
									'</div>'+
								'</div>'+
								//CONTENT
								'<div ng-if="item.isContent" class="directory-tree-content-box" ng-class="{\'directory-activeGroup\': !item.activeGroup}">'+
									'<div class="directory-tree-content-title" ng-click="editNode(item);">{{item.title}}</div>'+
									'<div class="directory-tree-buttons">'+
										'<img src="/cockpit/img/pencil_white.svg" ng-click="editNode(item)" height="30"/>'+
										'<!--img src="/cockpit/img/trash_white.svg" ng-click="removeNode(item,parent)" height="30"/-->'+
										'<span ng-click="activeGroupNode(item)" style="color:white;cursor:pointer;" ng-show="!item.activeGroup">{{ \'ENABLE-CONTENT\' | translate }}</span>'+
										'<span ng-click="activeGroupNode(item)" style="color:white;cursor:pointer;" ng-show="item.activeGroup">{{ \'DISABLE-CONTENT\' | translate }}</span>'+
									'</div>'+
								'</div>'+

							'</td>'+
						'</tr><tr><td ng-if="cs"></td><td ng-if="cs" ng-class="{\'directory-tree-line\':!$last}"></td><td>'+
							'<div class="directory-tree-children" ng-if="item.opened">'+
								'<table cellspacing="0" cellpadding="0" style="width:100%"><tr>'+
									'<td width="76"></td>'+
									'<td width="28">'+
										'<div class="directory-tree-top-spacer"></div>'+
										'<div class="directory-tree-bottom-spacer" ng-class="{\'last\':!item.children.length}"></div>'+
									'</td>'+
									'<td>'+
										'<div class="diretory-tree-sepacer">'+
											'<button class="directory-tree-btn-answer" ng-click="createContentNode(item)" >{{\'ANSWER-BUTTON-CREATE\' | translate}}</button>'+
											'<div class="directory-tree-btn-divider"></div>'+
											'<button class="directory-tree-btn-dir" ng-click="createDirNode(item)" >{{\'ANSWER-BUTTON-CREATE-DIR\' | translate}}</button>'+
										'</div>'+
									'</td>'+
								'</tr></table>'+
								'<directory-tree items="item.children" parent="item" cs="true"/>'+
							'</div>'+
						'</td></tr></table>'+
					'</div>';
		
		return {
			restrict:'E',
			scope: {
				items:'=',
				cs:'=',
				parent:'=',
				statusContent:'=',
				onOpen:'&',
				onEdit:'&',
				onRemove:'&',
				onCreateDir:'&',
				onCreateContent:'&',
				onActiveGroup:'&'
			},
			template:html,
			controller:function($scope) {
				var onSelectCallback=$scope.onOpen();
				if (onSelectCallback) {
					$scope.$on('selectDirNode',function(e,item){
						if (item.isContent)return;
						item.opened=!item.opened;
						if (item.opened && !item.openOnce)
							onSelectCallback(item);
						item.openOnce = true;
					});
				}

				
				var onEditCallback=$scope.onEdit();
				if (onEditCallback) {
					$scope.$on('editDirNode',function(e,item){
						onEditCallback(item);
					});
				}

				
				var onRemoveCallback=$scope.onRemove();
				if (onRemoveCallback) {
					$scope.$on('removeDirNode',function(e,item,parent){
						onRemoveCallback(item,parent);
					});
				}

				
				var onCreateDirCallback=$scope.onCreateDir();
				if (onCreateDirCallback) {
					$scope.$on('createDirNode',function(e,item){
						onCreateDirCallback(item);
					});
				}

				
				var onCreateContentCallback=$scope.onCreateContent();
				if (onCreateContentCallback) {
					$scope.$on('createContentNode',function(e,item){
						onCreateContentCallback(item);
					});
				}


				var onActiveGroupCallback=$scope.onActiveGroup();
				if (onActiveGroupCallback) {
					$scope.$on('activeGroupDirNode',function(e,item){
						onActiveGroupCallback(item);
						console.log(item);
					});
				}
				

				$scope.openNode = function(item) {
					$scope.$emit('selectDirNode',item);
				}
				$scope.editNode = function(item) {
					$scope.$emit('editDirNode',item);
				}
				$scope.removeNode = function(item) {
					$scope.$emit('removeDirNode',item,$scope.parent);
				}
				$scope.createDirNode = function(item) {
					$scope.$emit('createDirNode',item);
				}
				$scope.createContentNode = function(item) {
					$scope.$emit('createContentNode',item);
				}
				$scope.activeGroupNode = function(item) {
					$scope.$emit('activeGroupDirNode', item)
				}
			}
		};
	}
})();
