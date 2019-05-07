
(function() {
    'use strict';
    var myApp = angular.module('cockpitApp');

    /*
     A directive to enable two way binding of file field
     */
    myApp.directive('fileModelDirective', function ($parse) {
        return {
            restrict: "A",
            scope: {
                selectedFile: "=file"
            },
            /*
             link is a function that defines functionality of directive
             scope: scope associated with the element
             element: element on which this directive used
             attrs: key value pair of element attributes
             */
            link: function (scope, element, attrs) {
                //Bind change event on the element
                element.bind('change', function () {
                    //Call apply on scope, it checks for value changes and reflect them on UI
                    console.log("scope" , scope , element);
                    scope.selectedFile(element[0].files[0]);
                });
            }
        };
    });
})();
