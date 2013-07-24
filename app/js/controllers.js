'use strict';

var myApp = angular.module('myApp.controllers', []);

/* Factory */
myApp.factory('MyFactory', ['$http',function($http) {
    var people = {
        requestPeople: function(x) {
            var url = 'js/test.json';
            return $http.get(url);
        }
    };
    return people;
}]);


/* Controllers */
myApp.controller('MyCtrl1', ['$scope', 'MyFactory', function ($scope, MyFactory) {
    MyFactory.requestPeople(22).then(function(result) {
        $scope.peopleList = result;
    });
}]);
 