var dae = angular.module('dae', ['ngRoute','ctrl']);

dae.config(['$routeProvider',function($routeProvider) {
	$routeProvider.when('/flow', {
		templateUrl:'tpls/flow.html'
	}).when('/interpreter', {
		templateUrl:'tpls/interpreter.html'
	}).otherwise({
		redirectTo: '/interpreter'
	})
}]);

dae.directive("inheader",function(){
	return {
		restrict:'E',
        templateUrl:'tpls/interpreter_header.html',
		replace:true
	}
});

dae.directive("inbody",function(){
    return {
        restrict:'E',
        templateUrl:'tpls/interpreter_body.html',
        replace:true
    }
});

