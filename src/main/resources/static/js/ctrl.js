var crtl = angular.module('ctrl',[]);

crtl.controller('InterpreterCtrl',function ($scope) {
	$scope.area=[{b:2}];
	$scope.code=true;
	$scope.addPanel=function(){
		$scope.area.push({a:1});
	};
	$scope.deletePanel=function(index){
		$scope.area.splice(index,1);
	};
	$scope.switchCode=function(index){
		$scope.area[index].code=!$scope.area[index].code
	};
	$scope.isCodeShow=function(index){
		return $scope.area[index].code;
	}
});