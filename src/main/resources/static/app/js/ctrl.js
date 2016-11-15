var crtl = angular.module('crtl', []);

crtl.controller('InterpreterCtrl',function ($scope) {
    $scope.area=[{}];
    $scope.add=function(){
        $scope.area.push({});
    }
});