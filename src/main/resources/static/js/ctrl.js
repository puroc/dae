var crtl = angular.module('ctrl', []);

crtl.controller('InterpreterCtrl', function ($scope, $http) {
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
        }).error(function (data, status, config, headers) {
            alert("addParagraph failed");
        });
    };


    //删除程序
    $scope.deleteParagraph = function (index) {
        $http({
            method: "delete",
            url: "rest/api/notebook/" + $scope.notebookId + "/paragraph/" + $scope.paragraphs[index].id
        }).success(function (data, status, config, headers) {
            alert("deleteParagraph success");
            $scope.paragraphs.splice(index, 1);
        }).error(function (data, status, config, headers) {
            alert("deleteParagraph failed");
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
            console.log(result);
        }).error(function (data, status, config, headers) {
            alert("runParagraph failed");
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
            alert("getAllParagraphInfo failed");
        });
    };

    // 查询程序运行结果
    $scope.getParagraphInfo = function (index) {
        var para = $scope.paragraphs[index];
        $http({
            method:"get",
            url:"rest/api/notebook/" + $scope.notebookId + "/paragraph/" + para.id
        }).success(function(data, status, config, headers){
            console.log(data);
            para.output.content = data.body.result.msg;
        })
        .error(function(data, status, config, headers) {
            alert("getParagraphInfo failed");
        });;
    };

    //运行程序并查看结果
    $scope.runAndGetParagraph=function(index){
        $scope.runParagraph(index);
        $scope.getParagraphInfo(index);
    };

//初始化加载所有的程序
$scope.getAllParagraphInfo();
});