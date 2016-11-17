var crtl = angular.module('ctrl', ['InterpreterSerivce']);

crtl.controller('InterpreterCtrl', ['$scope','$http','notyService', function($scope, $http,notyService){
// crtl.controller('InterpreterCtrl', function ($scope, $http) {
    $scope.notebookId = "2C2CVMVRC";

    $scope.paragraphId = "";

    $scope.paragraphs = [];

    $scope.paragraph={
        id:null,
        index:null,
        input:{
            content:null,
            show:true
        },
        output:{
            content:null,
            show:true
        }
    };

    //切换隐藏/显示代码区域
    $scope.switchCode = function (index) {
        $scope.paragraphs[index].input.show = !$scope.paragraphs[index].input.show;
    };

    //代码区域是否显示
    $scope.isCodeShow = function (index) {
        return $scope.paragraphs[index].input.show;
    };

    //添加程序
    $scope.addParagraph = function () {
        var o = angular.copy($scope.paragraph);
        $http({
            method: "post",
            url: "rest/api/notebook/" + $scope.notebookId + "/paragraph",
            data: $scope.paragraph.input.content
        }).success(function (data, status, config, headers) {
            o.id= data.body;
            $scope.paragraphs.push(o);
            notyService.notify("添加成功","success");
        }).error(function (data, status, config, headers) {
            alert("addParagraph failed");
            notyService.notify("添加失败","error");
        });
    };


    //删除程序
    $scope.deleteParagraph = function (index) {
        $http({
            method: "delete",
            url: "rest/api/notebook/" + $scope.notebookId + "/paragraph/" + $scope.paragraphs[index].id
        }).success(function (data, status, config, headers) {
            $scope.paragraphs.splice(index, 1);
            notyService.notify("删除成功","success");
        }).error(function (data, status, config, headers) {
            notyService.notify("删除失败","error");
        });
    };


    // 运行程序
    $scope.runParagraph = function (index) {
        console.log($scope.code.content);
        var para = $scope.paragraphs[index];
        $http({
            method:"post",
            url:"rest/api/notebook/job/" + $scope.notebookId + "/" + para.id,
        }).success(function(data, status, config, headers){
            notyService.notify("运行成功","success");
        }).error(function (data, status, config, headers) {
            notyService.notify("运行失败","error");
        });
    };
    
    //获取所有的程序
    $scope.getAllParagraphInfo=function () {
        $http({
            method:"get",
            url:"rest/api/notebook/job/"+ $scope.notebookId
        }).success(function(data, status, config, headers){
            //清空数组
            $scope.paragraphs=[];
            //将返回的paragraph添加到数组中
            for(var i=0;i<data.body.length;i++){
                var p = angular.copy($scope.paragraph);
                p.id=data.body[i].id;
                $scope.paragraphs.push(p);
            }
        }).error(function(data, status, config, headers) {
            notyService.notify("获取程序失败","error");
        });
    };

    // 查询程序运行结果
    $scope.getParagraphInfo = function (index) {
        var para = $scope.paragraphs[index];
        $http({
            method:"get",
            url:"rest/api/notebook/" + $scope.notebookId + "/paragraph/" + para.id
        }).success(function(data, status, config, headers){
            para.output.content = data.body.result.msg;
            notyService.notify("获取运行结果成功","success");
        })
        .error(function(data, status, config, headers) {
            notyService.notify("获取运行结果失败","error");
        });;
    };

    //运行程序并查看结果
    $scope.runAndGetParagraph=function(index){
        $scope.runParagraph(index);
        $scope.getParagraphInfo(index);
    };

//初始化加载所有的程序
$scope.getAllParagraphInfo();

}

]);
