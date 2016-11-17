var crtl = angular.module('ctrl', []);

crtl.controller('InterpreterCtrl', function ($scope, $http) {
    $scope.notebookId = "2C2CVMVRC";

    $scope.paragraphId = "";

    // $scope.paragraph.index = 0;

    $scope.paragraphs = [];

    $scope.code = {
        content: null,
        init: {
            "title": "Paragraph insert revised5555",
            "text": "%spark\nprintln(\"Paragraph insert revised123\")",
            "index": 0
        }
    };

    $scope.result = {content: null};

    var obj = {showCode:true};


    //切换隐藏/显示代码区域
    $scope.switchCode = function (index) {
        $scope.paragraphs[index].showCode = !$scope.paragraphs[index].showCode
    };

    //代码区域是否显示
    $scope.isCodeShow = function (index) {
        return $scope.paragraphs[index].showCode;
    };

    //添加程序
    $scope.addParagraph = function () {
        var o = angular.copy(obj);
        $scope.paragraphs.push(o);
        $http({
            method: "post",
            url: "rest/api/notebook/" + $scope.notebookId + "/paragraph",
            data: $scope.code.init
        }).success(function (data, status, config, headers) {
            o.id= data.body;
        }).error(function (data, status, config, headers) {
            alert("addParagraph failed,status:" + status);
        });
    };


    //删除程序
    $scope.deleteParagraph = function (index) {
        $scope.paragraphs.splice(index, 1);
        $http({
            method: "delete",
            url: "rest/api/notebook/" + $scope.notebookId + "/paragraph/" + $scope.paragraphs[index]
        }).success(function (data, status, config, headers) {
            alert("success");
        }).error(function (data, status, config, headers) {
            alert("deleteParagraph failed,status:" + status);
        });
    };


    // 运行程序
    $scope.runParagraph = function () {
        console.log($scope.code.content);
        $http.post("rest/api/notebook/job/" + $scope.notebookId + "/" + $scope.paragraphId).then(function (result) {
            console.log(result);
            $scope.result.content = result.data.body[0].name;
        });
    };
    
    //获取所有的程序
    $scope.getAllParagraphInfo=function () {
        $http({
            method:"get",
            url:"rest/api/notebook/job/"+ $scope.notebookId
        }).success(function(data, status, config, headers){
            var o = angular.copy(obj);
            // var o ={showCode:true};
            for(var i=0;i<data.body.length;i++){
                o.id=data.body[i].id;
                $scope.paragraphs.push(o);
            }
        }).error(function(data, status, config, headers) {
            alert("failed,status:" + status);
        });
    };

    // 查询程序运行结果
    $scope.getParagraphInfo = function () {
        $http.get("rest/api/notebook/" + $scope.notebookId + "/paragraph/" + $scope.paragraphId).then(function (result) {
            console.log(result);
            $scope.result.content = result.data.body.result.msg;
        })
    };

//初始化加载所有的程序
$scope.getAllParagraphInfo();
});