'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function () {
    beforeEach(module('myApp.controllers'));
    var ctrl, scope, fakeFleet;

    beforeEach(inject(function ($rootScope, $controller, $q) {
        scope = $rootScope.$new();

        //Fake factory, no real 'success' method
        fakeFleet = {
            getStuff: function () { return { then: jasmine.createSpy() } }
        };

        spyOn(fakeFleet, 'getStuff').andCallThrough();

        ctrl = $controller('MyCtrl1', { $scope: scope, fleetTypesFactory: fakeFleet });
    }));


    it('Event Types Empty should default to false', inject(function () {
        expect(scope.isEventTypesEmpty).toBe(true);
    }));

    it('On init, api should be called', function() {
        expect(fakeFleet.getStuff).toHaveBeenCalled();
    });


   
});


describe('Controller gets bad response', function () {
    
    beforeEach(module('myApp.controllers'));
    var ctrl, scope, fakeFleet;

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();

        //Fake factory, no real 'success' method
        fakeFleet = {
            getStuff: function () { return { then: jasmine.createSpy() } }
        };

        ctrl = $controller('MyCtrl1', { $scope: scope, fleetTypesFactory: fakeFleet });

    }));

    it('EventTypesEmpty changes to false when an object is returned', function () {
        scope.FleetEventTypes = {'EventTypes':['1','2','3']};
        scope.$apply();
        expect(scope.isEventTypesEmpty).toBe(false);
    });
});


describe('proper mocking', function () {

     beforeEach(module('myApp.controllers'));

     var scope, fakeFactory, controller, q, deferred;

    //Prepare the fake factory
    beforeEach(function() {
        fakeFactory = {
                EventTypes: {"EventTypes":"test"},
                getStuff: function() {
                    console.log('fake called!');
                    deferred = q.defer();
                    return deferred.promise;
                }
        }
    });

    //Inject fake factory into controller
    beforeEach(inject(function($rootScope, $controller, $q) {
        scope = $rootScope.$new();
        q = $q;
        controller = $controller('MyCtrl1', { $scope: scope, fleetTypesFactory: fakeFactory });
    }  ));

    it('this is the test...', function () {
        spyOn(fakeFactory, 'getStuff').andCallThrough();
        //scope.init();
        deferred.resolve();

        scope.$apply();
        scope.$root.$digest();
        expect(fakeFactory.getStuff).toHaveBeenCalled();
    });

});


function PeopleListController($scope, people) {
    $scope.peopleList = [];

    $scope.init = function() {
        people.requestPeople().then(function() {
            $scope.peopleList = people.peopleStore;
        });
    };
}

describe('People List Controller', function() {
    var scope;
    var peopleService;
    var controller;
    var q;
    var deferred;

    // define the mock people service
    beforeEach(function() {
        peopleService = {
            peopleStore: [{
                FirstName: "Jim",
                LastName: "Lavin",
                Email: "jlavin@jimlavin.net",
                Bio: "Creator and Host of Coding Smackdown TV"}],

            requestPeople: function() {
                deferred = q.defer();
                return deferred.promise;
            }
        };
    });

    // inject the required services and instantiate the controller
    beforeEach(inject(function($rootScope, $controller, $q) {
        scope = $rootScope.$new();
        q = $q;
        controller = $controller(PeopleListController, {
            $scope: scope,
            people: peopleService
        });
    }));

    it('should call requestPeople on the people service when init is called',

        function() {
            spyOn(peopleService, 'requestPeople').andCallThrough();

            scope.init();

            deferred.resolve();

            scope.$root.$digest();

            expect(peopleService.requestPeople).toHaveBeenCalled();
        });

    it('should populate the peopleList when init is called',

        function() {
            scope.init();

            deferred.resolve();

            scope.$root.$digest();

            expect(scope.peopleList).not.toBe([]);
        });
});
