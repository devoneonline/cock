/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* * Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Luiz Afonso Andre, Renan Ventura Silva, Evelyn Neves Barreto.
* All rights reserved
*/ 

app.config(['$translateProvider', function ($translateProvider) {
    
    //GET .JSON OF ACCORDING PREFIX
    $translateProvider.useStaticFilesLoader({
        prefix: '../../lang/dashboards/qlik-',
        suffix: '.json'
    });

    $translateProvider.useSanitizeValueStrategy('escapeParameters');

    //GET ACTUAL LANGUAGE IN DASHBOARDS
    $translateProvider.preferredLanguage(dashboardsLanguageName);
}]);


//CONFIGURE THE ANGULAR TOOLTIP OPTIONS
app.config(['tooltipsConfProvider', function configConf(tooltipsConfProvider) {
    tooltipsConfProvider.configure({
      'smart': false,
      'size': 'large',
      'speed': 'medium',
      'showTrigger':'click',
      'class':'label-description',
      'side':'left'
    });
}]);


// Example of how to set default values for all dialogs
app.config(['dialogsProvider','$translateProvider',function(dialogsProvider,$translateProvider){
	dialogsProvider.useBackdrop(false);
	dialogsProvider.useEscClose(false);
	dialogsProvider.useCopy(false);
	dialogsProvider.setSize('sm');
}])



//DIRECTIVE TO PUT OPACITY IN VISUALIZATION - tag qlik-opacity
app.directive("qlikOpacity", function(){
    return {
        restrict: 'A',
        link: function(scope, elem, attrs){
            scope.$watch(attrs.qlikOpacity, function(value){
                if (value) {
                    elem.addClass("hide-elm-rule");
                } else {
                    elem.removeClass("hide-elm-rule");
                }
            });
        }
    };
});




