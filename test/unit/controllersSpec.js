'use strict';

/* jasmine specs for controllers go here */


describe('proper mocking', function () {

    beforeEach(module('myApp.controllers'));

    var scope, fakeFactory, controller, q, deferred;

    //Prepare the fake factory
    beforeEach(function() {
        fakeFactory = {
            getStuff: function() {
                deferred = q.defer();
                //Place fake return object here
                deferred.resolve({ "EventTypes": "FakeResponse" });
                return deferred.promise;
            }
        };
        spyOn(fakeFactory, 'getStuff').andCallThrough();
    });

    //Inject fake factory into controller
    beforeEach(inject(function($rootScope, $controller, $q) {
        scope = $rootScope.$new();
        q = $q;
        controller = $controller('MyCtrl1', { $scope: scope, fleetTypesFactory: fakeFactory });
    }  ));

    it('this is the test...', function () {
        // Before $apply is called the promise hasn't resolved
        expect(scope.FleetEventTypes).not.toBeDefined();

        //This propagates the changes to the models
        scope.$apply();

        expect(scope.FleetEventTypes).toBeDefined();
        expect(fakeFactory.getStuff).toHaveBeenCalled();
        expect(scope.FleetEventTypes).toBe("FakeResponse");
    });

});
