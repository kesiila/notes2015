"use strict";
innerApp.controller('customerImportCtrl',['$rootScope','$scope','$http','$location','$timeout',
    function ($rootScope,$scope,$http,$loaction,$timeout){
        $rootScope.global.loading_done = true;
        $rootScope.$watch("projects",function(projects){
            if(projects.length>0){
                $scope.currentProjectId=projects[0].pid;
            }
        })
        $rootScope.$watch("teams",function(teams){
            if(teams.length>0){
                $scope.currentTeamId=teams[0].team_id;
            }
        });
        var lessonTagEnums = {
            "音乐舞蹈":"lesson_music_dance",
            "美术艺术":"lesson_painting_art",
            "传统文化":"lesson_tradition_culture",
            "亲子早教":"lesson_music_childhood_parenting",
            "创意动手":"lesson_originality",
            "运动户外":"lesson_sport_outdoor",
            "其他":"lesson_else"
        }

        $scope.systemFieldList = [
            {
                name: "vip",
                value: "level",
                pattern: /.*分区.*/i
            },
            {
                name: "机构名称",
                value: "organizer_name",
                pattern: /.*品牌名.*/i
            },
            {
                name: "描述",
                value: "desc",
                pattern: /.*描述.*/i
            },
            {
                name: "标签",
                value: "tagA",
                pattern: /.*课程标签A.*/i
            },
            {
                name: "标签",
                value: "tagB",
                pattern: /.*课程标签B.*/i
            },
            {
                name: "标签",
                value: "tagC",
                pattern: /.*课程标签C.*/i
            },
            {
               name: "名额",
                value: "quota",
                pattern: /.*名额.*/i
            },
            {
                name: "费用",
                value: "fee",
                pattern: /.*原价.*/i
            },
            {
                name: "结算价1",
                value: "final_fee1",
                pattern: /.*结算价.*(首次|1).*/i
            },
            {
                name: "结算价2",
                value: "final_fee2",
                pattern: /.*结算价.*2.*/i
            },
            {
                name: "结算价3",
                value: "final_fee3",
                pattern: /.*结算价.*3.*/i
            },
            {
                name: "时长",
                value: "duration",
                pattern: /.*时长.*/i

            },
            {
                name: "开始时间",
                value: "start_date",
                pattern: /.*开始.*/i
            },
            {
                name: "机构id",
                value: "organizer_id",
                pattern: /.*机构.*id|.*主办方.*id/i
            },
            {
                name: "时长",
                value: "duration",
                pattern: /.*时长.*/i
            },
            {
                name: "课程名称",
                value: "title",
                pattern: /.*课程名称.*/i
            },
            {
                name: "最小年龄",
                value: "minAge",
                pattern: /.*最小年龄.*/i
            },
            {
                name: "最大年龄",
                value: "maxAge",
                pattern: /.*最大年龄.*/i
            },
            {
                name: "图片链接",
                value: "imageUrl",
                pattern: /.*图片.*/
            },
            {
                name: "备注信息",
                value: "remarkInfo",
                pattern: /.*备注.*/
            },
            {
                name: "错误项(忽略)",
                value: "errorField",
                pattern: /.*请选择.*/
            }
        ];

        function mapRawExcelDataToRawProgram(excelData) {
            function mapRawData2Program(rawData, map /*$scope.clientFieldList*/) {
                /**合并两个列表*/
                return _.reduce(map, function (acc, item) {
                    acc[item["mappedFieldName"]] = rawData[item["fieldName"]];
                    return acc;
                }, {});
            }

            function arrayToObject(array1) {
                return function (array2) {
                    return _.object(array1, array2);
                }
            }

            var toHashMap = arrayToObject($scope.rtnExcelData[0]);

            return _.map(_.rest(excelData), function (rawData) {
                return mapRawData2Program(toHashMap(rawData), $scope.clientFieldList);
            })
        }

        function mapRawProgramToProgram (rawProgram) {
            function makeDateRange(rawProgram) {
                return {
                    start_date: new Date(rawProgram.start_date).getTime(),
                    end_date: new Date(rawProgram.start_date).getTime() + rawProgram.duration * 1 * 60 * 1000
                }
            }

            function makeFinalFee(rawProgram) {
                return [rawProgram.final_fee1, rawProgram.final_fee2, rawProgram.final_fee3]
                    .map(function (item) {
                        return (item || 0) * 1
                    });
            }

            function makeLevel(string) {
                return "vip" == (string || "").toLowerCase()
                    ? "permission_program_participate_vip"
                    : "permission_program_participate_basic";
            }

            function makeLessonCategory(rawProgram) {
                return _.chain([rawProgram.tagA, rawProgram.tagB, rawProgram.tagC])
                    .filter(function (tag) { return lessonTagEnums[tag] })
                    .map(function (tagCnName) { return lessonTagEnums[tagCnName]})
                    .join("-")
                    .value();
            }
            function trim (str) {
                return (str || "").trim();
            }

            return {
                title: trim(rawProgram.title),
                maxAge: rawProgram.maxAge * 1,
                minAge: rawProgram.minAge * 1,
                organizer_id: trim(rawProgram.organizer_id),
                fee: rawProgram.fee * 1,
                quota: rawProgram.quota * 1,
                desc: rawProgram.desc,
                imageUrl: trim(rawProgram.imageUrl),
                code_permission: makeLevel(rawProgram.level),
                date_list: [makeDateRange(rawProgram)],
                final_fee: makeFinalFee(rawProgram),
                code_lesson_category: makeLessonCategory(rawProgram),
                remarkInfo: rawProgram.remarkInfo || "",
                status: 0,
                /*列表外信息*/
                pid: $scope.current_pid || "",
                code_program_type: "program_type_lesson",
                code_address: "address_111002", //默认地: 上海

            }
        }

        $scope.import_again = function () {
            $scope.clientFieldList=[];
            $scope.isUpload=false;
            $scope.currentStep=1;
        }
        
        $scope.currentItem=1;
        
        $scope.clientFieldList=[];

        $scope.isUpload=false;

        $scope.currentStep=1;

        $scope.$on("fileuploadfail", function (e,data) {
            if(data.total > 1024 * 1024) {
                $scope.error_msg = "上传失败，文件大小不应超过1M";
                $scope.uploading_done = true;
            }
        });

        function removeEmptyList(lists) {
            return _.chain(lists)
                .filter(function (list) {
                    return _.chain(list).reduce(function(acc, i){
                       return acc + i;
                    }, "").value().replace(/\s+/g, "") != "";
                }).value();
        }

        $scope.options = {
            url: '/api/programs/import',
            add:function (event, data) {
            	var fileName=data.files[0].name;
            	if(fileName.indexOf(".xls")<0){
            		kzi.msg.error("文件格式应为EXCEL！");
            		return;
            	}else{
            		data.process().done(function () {
        	            data.submit();
        	        });
            	}            		
            },
            start:function(event,data){
                $rootScope.global.loading_done = false;
            },
            done: function (event,data) {
                if(data.result.data.length>0){
                    $scope.rtnExcelData = removeEmptyList(data.result.data);
                    angular.forEach($scope.rtnExcelData[0],function(value,key){
                        var clientField={};
                        var isMapped=false;
                        clientField.columnIndex=key;
                        angular.forEach($scope.systemFieldList,function(field){
                            clientField.fieldName=value;
                            if(field.pattern.test(value)){
                                clientField.mappedFieldName=field.value;
                                isMapped=true;
                                return false;
                            }
                            if(isMapped==false){
                                clientField.mappedFieldName=value;
                            }
                        })
                        $scope.clientFieldList.push(clientField);
                    })
                    $scope.currentRow=$scope.rtnExcelData[$scope.currentItem];
                    $scope.isUpload=true;
                    $scope.currentStep=2;
                    $rootScope.global.loading_done = true;
                }                 
            }
        };       
        
        $scope.next=function(){
            if($scope.currentItem<10){
                $scope.currentItem++;
            }else{
                $scope.currentItem=1;
            }
            $scope.currentRow=$scope.rtnExcelData[$scope.currentItem];
        }
        
        $scope.prev=function(){
            if($scope.currentItem>1){
                $scope.currentItem--;
            }else{
                $scope.currentItem=10;
            }
            $scope.currentRow=$scope.rtnExcelData[$scope.currentItem];
        }


        $scope.save=function(){
            $rootScope.global.loading_done = false;
            var rawDatas = mapRawExcelDataToRawProgram($scope.rtnExcelData);
            var data = _.map(rawDatas, mapRawProgramToProgram);
            $http.post('/api/programs/import/save',
                {
                    data: data
                }
            ).success(function(response){
                 $scope.currentStep=3;
                 $scope.totalItems=response.data;
                 $rootScope.global.loading_done = true;
                 $rootScope.teams[0].task_count+=$scope.clientFieldList.length;
                 $rootScope.teams[0].private_task_count+=$scope.clientFieldList.length;
                 kzi.msg.success("导入成功！");
                 //$loaction.url('/project/'+$scope.currentProjectId +'?team_id='+$scope.currentTeamId);
            }).error(function(response){
                    kzi.msg.error("导入失败！");
                })
        }

        /**
         * 取消excel文件导入
         */
        $scope.cancel_excel_import=function(){
            $scope.clientFieldList=[];
            $scope.isUpload=false;
            $scope.currentStep=1;
//            $loaction.url('/project/'+$scope.currentProjectId +'?team_id='+$scope.currentTeamId);
        }

    }
]);


innerApp.controller('customerVCardCtrl',['$rootScope','$scope','$http','$location',
    function ($rootScope,$scope,$http,$loaction){
        $rootScope.global.loading_done = true;
        $rootScope.$watch("projects",function(projects){
            if(projects.length>0){
                $scope.currentProjectId=projects[0].pid;
            }
        })
        $scope.isUpload=false;
        $scope.currentStep=1;
        $scope.options = {
            url: '/api/tasks/vcard/import',
            start:function(event){
                $rootScope.global.loading_done = false;
            },
            done: function (event,data) {
                if(data.result.data.length>0){
                    $scope.customerList = data.result.data;
                    $scope.isUpload=true;
                    $scope.currentStep=2;
                    $rootScope.global.loading_done = true;
                }
            }
        };

        $scope.save=function(){
            if($scope.mainIndustryCode==''||typeof($scope.mainIndustryCode)=='undefined'){
                kzi.msg.warn("请先选择一个行业！");
                return;
            }
            $rootScope.global.loading_done = false;
            $http.post(
                '/api/tasks/vcard/save',
                $scope.customerList,
                {
                    'params':{
                        'pid':$scope.currentProjectId,
                        'mainIndustryCode':$scope.mainIndustryCode,
                        'mainIndustryCnName':$scope.mainIndustryCnName,
                        'subIndustryCode':$scope.subIndustryCode,
                        'subIndustryCnName':$scope.subIndustryCnName
                    }
                }
            ).success(function(response){
                    $scope.currentStep=3;
                    $scope.totalItems=response.totalItems;
                    $rootScope.global.loading_done = true;
                    kzi.msg.success("导入成功！");
                }).error(function(response){
                    kzi.msg.error("导入失败！");
                })
        }

        $scope.cancel=function(){
            $loaction.url('/programs');
        }
    }
]);