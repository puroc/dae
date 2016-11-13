var dae = angular.module('dae', ['ngRoute']);

dae.config(['$routeProvider',function($routeProvider) {
	$routeProvider.when('/flow', {
		templateUrl:'tpls/flow.html'
	}).when('/interpreter', {
		templateUrl:'tpls/interpreter.html'
	}).otherwise({
		redirectTo: '/flow'
	})
}]);

