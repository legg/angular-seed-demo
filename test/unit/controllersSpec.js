'use strict';

describe('mocking the factory response', function () {

    beforeEach(module('myApp.controllers'));

    var scope, fakeFactory, controller, q, deferred;

    //Prepare the fake factory
    beforeEach(function() {
        fakeFactory = {
            requestPeople: function() {
                deferred = q.defer();
                //Place fake return object here
                deferred.resolve("test");
                return deferred.promise;
            }
        };
        spyOn(fakeFactory, 'requestPeople').andCallThrough();
    });

    //Inject fake factory into controller
    beforeEach(inject(function($rootScope, $controller, $q) {
        scope = $rootScope.$new();
        q = $q;
        controller = $controller('MyCtrl1', { $scope: scope, MyFactory: fakeFactory });
    }  ));

    it('The peopleList object is not defined yet', function () {
        // Before $apply is called the promise hasn't resolved
        expect(scope.peopleList).not.toBeDefined();
    });

    it('Applying the scope causes it to be defined', function () {
        // This propagates the changes to the models
        // This happens itself when you're on a web page, but not in a unit test framework
        scope.$apply();
        expect(scope.peopleList).toBeDefined();
    });

    it('Ensure that the method was invoked', function () {
        scope.$apply();
        expect(fakeFactory.requestPeople).toHaveBeenCalled();
    });

    it('Check the value returned', function () {
        scope.$apply();
        expect(scope.peopleList).toBe("test");
    })
});
