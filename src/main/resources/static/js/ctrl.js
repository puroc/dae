var crtl = angular.module('ctrl',[]);

crtl.controller('InterpreterCtrl',function ($scope) {
	$scope.area=[{b:2}];
	$scope.code=true;
	$scope.addPanel=function(){
		$scope.area.push({a:1});
	};
	$scope.deletePanel=function(index){
		// console.log(index);
		$scope.area.splice(index,1);
	};
	$scope.showCode=function(){
		$scope.code = !$scope.code;
	};
});