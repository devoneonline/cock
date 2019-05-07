/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

var app = angular.module("cockpitApp");

app.controller('settingsCtrl', function($scope, $http, $location,leftBar,confirmModal, messages, loading) {
    leftBar.hide();

    $scope.projects = [];

    $scope.groups = [];
    $scope.users = [];
    $scope.user = {};
    $scope.userError = {};
    
    $scope.statuses = [];
    $scope.status = {success:'0',defaultStatus:false};
    $scope.statusError = {};

    $scope.configurations = [];
    $scope.configParam = {};
    $scope.configParamError = {};

    function loadVersion() {
        $http.get('/cockpit/v1/configurations/version')
            .then(
                function(res) {
                    $scope.version = res.data.version;
                }
            )
    }

    loadVersion();

    $scope.loadUsers = function() {
        $http.get('/cockpit/v1/users').then(function(res){
            $scope.users = res.data;
            $scope.preLoad();
        });
    };
    $scope.selectUser = function(u){
        for (i in $scope.projects)$scope.projects[i].selected = false;
        $scope.userError = {};
        $scope.user = u;
        if (u.id) {
            $http.get('/cockpit/v1/users/'+u.id).then(
                //SUCCESS
                function (res) {
                    $scope.user = res.data;
                    $scope.user.groupId+='';
                    if ($scope.user.active)$scope.user.active = true;
                    $scope.userProjects();
                    $('#userModal').modal({"show":true});
                },
                //ERROR
                function (res) {
                    messages.error('SETTINGS-LOAD-USER-ERROR');
                }
            );
        } else {
            u.active = true;
            $('#userModal').modal({"show":true});
        }
    };
    $scope.userProjects = function() {
        for (i in $scope.projects)
            for (j in $scope.user.projects)
                if ($scope.projects[i].id == $scope.user.projects[j].id)
                    $scope.projects[i].selected = true;
    }
    $scope.removeUser = function(uid) {
        confirmModal.show('SETTINGS-REMOVE-USER-TITLE','SETTINGS-REMOVE-USER-TEXT', function() {
            $http.delete('/cockpit/v1/users/'+uid).then(function() {
                messages.success('SETTINGS-USER-REMOVED');
                $scope.loadUsers();
            });
        });
    };
    $scope.userChangeGroup = function() {
        $scope.user.statusAdmin = $scope.user.groupId;
    }
    $scope.saveUser = function() {
        $scope.userError = {};
        var u = $scope.user;
        var ue = $scope.userError;
        var error = false;

        var numbers = /[0-9]/;
        var letters = /[a-zA-Z]/;
        var characters = /[-!&_+@]/;

        if (!u.name) {
            error = true;
            ue.name = 'REQUIRED-FIELD';
        }
        if (!u.company) {
            error = true;
            ue.company = 'REQUIRED-FIELD';
        }
        if (!u.position) {
            error = true;
            ue.position = 'REQUIRED-FIELD';
        }
        if (!u.email) {
            error = true;
            ue.email = 'REQUIRED-FIELD';
        } else if (!validateEmail(u.email)) {
            error = true;
            ue.email = 'INVALID-EMAIL';
        }
        if (!u.id) {
            if (!u.password) {
                error = true;
                ue.password = 'REQUIRED-FIELD';
            }
            if (u.password != u.confirmPassword) {
                error = true;
                ue.password = 'PASSWORD-CHECK';
                ue.confirmPassword = 'PASSWORD-CHECK';
            }
            if (!u.confirmPassword) {
                error = true;
                ue.confirmPassword = 'REQUIRED-FIELD';
            }
        } else {
            if (u.password && !u.confirmPassword) {
                error = true;
                ue.confirmPassword = 'REQUIRED-FIELD';
            } else if (u.password && u.password != u.confirmPassword) {
                error = true;
                ue.password = 'PASSWORD-CHECK';
                ue.confirmPassword = 'PASSWORD-CHECK';
            }
        }

        u.statusAdmin = u.groupId == 1;
        u.ivr = u.groupId == "ura";

        
        if (!u.statusAdmin && !u.groupId) {
            error = true;
            ue.groupId = 'REQUIRED-FIELD';
        }

        if (error) return;

        // if (u.statusAdmin || u.ivr) {delete u.groupId;}

        u.projects = [];
        for (i in $scope.projects) {
            if ($scope.projects[i].selected)
                u.projects.push($scope.projects[i]);
        }

        var method = u.id ? 'PUT' : 'POST';
        var uri = '/cockpit/v1/users' + (u.id ? '/'+u.id : '');
        
        if((letters.test(u.password) && numbers.test(u.password)
        || letters.test(u.password) && characters.test(u.password)
        || numbers.test(u.password) && characters.test(u.password))) {
            $scope.savingUser = true;
            $http({
                "method":method,
                "url":uri,
                "headers":{
                    "Content-type":"application/json"
                },
                "data":u
            }).then(
                //SUCCESS
                function(res) {
                    $scope.loadUsers();
                    messages.success(u.id?"SETTINGS-USER-UPDATED":"SETTINGS-USER-CREATED");
                    $('#userModal').modal("hide");
                    $scope.savingUser = false;
                },
                //ERROR
                function (res) {
                    console.log(res.data);
                    messages.error(res.data.message ? res.data.message : JSON.stringify(res.data));
                    $scope.loadUsers();
                    $('#userModal').modal("hide");
                    $scope.savingUser = false;
                }
            );
        } else {
            messages.error('NEW-PASSWORD-WRONG')
        }

    };

    $scope.loadGroups = function() {
        $http.get('/cockpit/v1/groups').then(function(res){
            $scope.groups = res.data;
        });
    };

    $scope.loadProjects = function() {
        $http.get('/cockpit/v1/projects').then(function(res){
            $scope.projects = res.data;
        });
    };

    $scope.loadAnswerStatus = function() {
        $http.get('/cockpit/v1/answers/status').then(function(res){
            $scope.statuses = res.data;
            for(i in $scope.statuses) {
                var s = $scope.statuses[i];
                s.oldName = s.name;
                s.defaultStatus = s.defaultStatus ? true : false;
                s.isDefault = s.defaultStatus;
                s.success=s.success?'1':'0';
                s.error = {};
            }
            $scope.preLoad();
        });
    };

    $scope.selectStatus = function(s) {
        if (!s)s = {defaultStatus:false};
        $scope.status = angular.copy(s);
        $scope.statusError = {};
        $('#statusModal').modal("show");
    }
    $scope.saveStatus = function() {
        var s = $scope.status;
        var se = $scope.statusError;
        var error = false;
        if (!s.name) {
            error = true;
            se.name = 'REQUIRED-FIELD';
        }
        if (!s.success) {
            error = true;
            se.success = 'REQUIRED-FIELD';
        }
        if(error)return;

        $scope.savingStatus = true;
        var uri = '/cockpit/v1/answers/status/' + (s.id ? s.id : '');
        var method = s.id ? "PUT" : "POST";
        $http({
            "method":method,
            "url":uri,
            "headers":{
                "Content-type":"application/json"
            },
            "data":s
        }).then(
            //SUCCESS
            function(res) {
                $scope.loadAnswerStatus();
                messages.success(s.id?"SETTINGS-STATUS-UPDATED":"SETTINGS-STATUS-CREATED");
                $('#statusModal').modal("hide");
                $scope.savingStatus = false;
            },
            //ERROR
            function (res) {
                console.log(res.data);
                messages.error(res.data.message ? res.data.message : JSON.stringify(res.data));
                $('#statusModal').modal("hide");
                $scope.savingStatus = false;
            }
        );
    };

    $scope.removeStatus = function(stat) {
        if (stat.defaultStatus) {
            messages.warning("SETTINGS-REMOVE-STATUS-DEFAULT");
            return;
        }
        confirmModal.show('SETTINGS-REMOVE-STATUS-TITLE','SETTINGS-REMOVE-STATUS-TEXT', function() {
            $http.delete('/cockpit/v1/answers/status/'+stat.id).then(function() {
                messages.success('SETTINGS-STATUS-REMOVED');
                $scope.loadAnswerStatus();
            });
        });
    };


    $scope.selectConfig = function(c) {
        if (!c)c = {defaultStatus:false};
        $scope.configParam = angular.copy(c);
        $scope.configParamError = {};
        $('#configModal').modal("show");
    }
    $scope.loadConfigurations = function () {
        $http.get('/cockpit/v1/configurations').then(function(res){
            $scope.configurations = res.data;
            for (i in $scope.configurations) {
                var c = $scope.configurations[i];
                c.oldKey = c.configKey;
                c.oldValue = c.configValue;
            }
            $scope.preLoad();
        });
    }
    $scope.createConfig = function() {
        var c = $scope.configParam;
        var ce = $scope.configParamError;
        if (!c.configKey) {
            ce.configKey = 'REQUIRED-FIELD';
            return;
        }
        $scope.savingConfig = true;
        $http.post('/cockpit/v1/configurations', $scope.configParam).then(
            //SUCCESS
            function(res) {
                $scope.configParam = {};
                $scope.configParamError = {};
                $scope.loadConfigurations();
                messages.success("SETTINGS-PARAM-CREATED");
                $scope.savingConfig = false;
                $('#configModal').modal("hide");
            },
            //ERROR
            function(res) {
                console.log(res.data);
                messages.error(res.data.message ? res.data.message : JSON.stringify(res.data));
                $scope.savingConfig = false;
            }
        );
    }
    $scope.updateConfig = function (config) {
        c = angular.copy(config);
        delete c.oldKey;
        delete c.oldValue;

        $scope.savingConfig = true;
        $http.put('/cockpit/v1/configurations/'+config.oldKey, c).then(
            //SUCCESS
            function(res) {
                $scope.loadConfigurations();
                messages.success("SETTINGS-PARAM-UPDATED");
                $scope.savingConfig = false;
                $('#configModal').modal("hide");
            },
            //ERROR
            function(res) {
                console.log(res.data);
                messages.error(res.data.message ? res.data.message : JSON.stringify(res.data));
                $scope.savingConfig = false;
            }
        );
    }
    $scope.removeConfig = function(key) {
        confirmModal.show('SETTINGS-REMOVE-PARAM-TITLE','SETTINGS-REMOVE-PARAM-TEXT', function() {
            $http.delete('/cockpit/v1/configurations/'+key).then(function() {
                messages.success('SETTINGS-PARAM-REMOVED');
                $scope.loadConfigurations();
            });
        });
    };
    $scope.cancelConfig = function(c) {
        c.configKey = c.oldKey;
        c.configValue = c.oldValue;
    };

    $scope.loadUsers();
    $scope.loadGroups();
    $scope.loadProjects();
    $scope.loadAnswerStatus();
    $scope.loadConfigurations();

    var cont = 3;

    $scope.preLoad = function() {
        cont--;
        if (cont == 0){
            loading.hide();
        }
    }
});
