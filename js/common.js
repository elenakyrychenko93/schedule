
let scheduleApp = angular.module("scheduleApp", ['ngAnimate', 'ngSanitize', 'ui.bootstrap'])
    .controller('scheduleController', function ($scope, $filter, $element) {

        $scope.schedule = [];

        $.ajax({
            url: 'https://articles-cdc1a.firebaseio.com/schedule-list.json',
            type: 'GET',
            dataType: "json",
            success: function (data) {
                for (let objName in data) {
                    data[objName].id = objName;
                }
                for (let key in data) {
                    $scope.schedule.push(data[key]);
                }
                $scope.$apply();
            }

        });

        // timepicker------------------------

        $scope.StartTimePick = new Date();
        $scope.EndTimePick = new Date();


        $scope.hstep = 1;
        $scope.mstep = 1;

        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = false;

        // timepicker------------------------
        // timepickerEdit------------------------


        // timepickerEdit------------------------

        $scope.addAction = function () {

            $scope.formIn = {
                StartTime: $scope.StartTimePick.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                EndTime: $scope.EndTimePick.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                Description: $scope.formInfo.Description
            };
            // console.log($scope.StartTimePick);


            $.ajax({
                type: "post",
                url: "https://articles-cdc1a.firebaseio.com/schedule-list.json",
                data: JSON.stringify($scope.formIn),
                success: function (data) {
                    // console.log(data.name);
                    $scope.formIn.id = data.name;
                    $scope.schedule.push($scope.formIn);
                    $scope.$apply()
                }
            });

        };





    })

    // .controller('FirstTimepickerCtrl', function ($scope, $log) {
    //     $scope.mytime = new Date();
    //
    //     $scope.hstep = 1;
    //     $scope.mstep = 1;
    //
    //     $scope.options = {
    //         hstep: [1, 2, 3],
    //         mstep: [1, 5, 10, 15, 25, 30]
    //     };
    //
    //     $scope.ismeridian = false;
    //     // $scope.toggleMode = function() {
    //     //     $scope.ismeridian = ! $scope.ismeridian;
    //     // };
    //     //
    //     // $scope.update = function() {
    //     //     let d = new Date();
    //     //     d.setHours( 14 );
    //     //     d.setMinutes( 0 );
    //     //     $scope.mytime = d;
    //     // };
    //     //
    //     // $scope.changed = function () {
    //     //     $log.log('Time changed to: ' + $scope.mytime);
    //     // };
    //     //
    //     // $scope.clear = function() {
    //     //     $scope.mytime = null;
    //     // };
    // })

    .directive('trAction', function () {
    return {
        restrict: 'EA',
        scope: {
            schedule: '=',
            action: '='
        },
        template: `<div class="tr" ng-if="editMode == false">
                   <div class="td">{{action.StartTime}}</div>
                    <div class="td">{{action.EndTime}}</div>
                    <div class="td">{{action.Description}}
                        <button class="delete" ng-click="deleteAction()"><i class="fa fa-trash" aria-hidden="true"></i></button>
                    <button class="update" ng-click="updateAction()"><i class="fa fa-pencil" aria-hidden="true"></i></button>
                 </div>
              </div>
              <div class="tr edit" ng-show="editMode == true">

                   <div class="td">
                   <input ng-model="action.StartTime" class="timepicker">
                    <!--<div uib-timepicker ng-model="StartTimeEdit" show-meridian="ismeridian"></div>-->
                   </div>
                    <div class="td"><input ng-model="EndTimeEdit" class="timepicker"></div>
                    <div class="td"><input ng-model="DescriptionEdit">
                    
                    <button class="update" ng-click="backToDefault()"><i class="fa fa-times" aria-hidden="true"></i></i></button>
                    <button class="update" ng-click="saveAction()"><i class="fa fa-floppy-o" aria-hidden="true"></i></button>
                 </div>
              </div>`,

        controller: ['$scope', '$element', function($scope, $element) {
            const $ctrl = this;
            // console.log($scope.action);
            $scope.editMode = false;


            // // timepickerEdit------------------------
            //
            // $scope.StartTimeEdit = $scope.action.StartTime;
            // $scope.EndTimeEdit = $scope.action.EndTime;
            //
            // // $scope.hstep = 1;
            // // $scope.mstep = 1;
            // //
            // // $scope.options = {
            // //     hstep: [1, 2, 3],
            // //     mstep: [1, 5, 10, 15, 25, 30]
            // // };
            // //
            // // $scope.ismeridian = false;
            //
            // // timepickerEdit------------------------


            $ctrl.$postLink = function(){
                // console.log($scope.action.StartTime);
            }

            $scope.deleteAction = function () {
                let actionToDelete = $scope.action.id;
                for(let i=0; i<$scope.schedule.length; i++) {
                    if($scope.schedule[i].id == actionToDelete) {
                        $scope.schedule.splice(i, 1);
                    }
                }
                // $scope.schedule = $scope.schedule.filter(i => i.id !== actionToDelete);

                $.ajax({
                    type: "DELETE",
                    url: "https://articles-cdc1a.firebaseio.com/schedule-list/" + actionToDelete + ".json",
                    cache: false,
                    success: function () {
                        $scope.$apply()

                    }
                });

            };
            $scope.updateAction = function () {
                $scope.editMode = true;



            };
            $scope.saveAction = function () {
                let actionToUpdate = $scope.action.id;

                $scope.editAction = {
                    StartTime: $scope.action.StartTime,
                    EndTime: $scope.action.EndTime,
                    Description: $scope.action.Description,
                    id: actionToUpdate
                };
                // console.log($scope.action.StartTime);

                // $.ajax({
                //     type: "PATCH",
                //     url: "https://articles-cdc1a.firebaseio.com/schedule-list/" + actionToUpdate + ".json",
                //     data: JSON.stringify($scope.editAction),
                //     success: function () {
                //         $scope.editMode = false;
                //         $scope.$apply()
                //
                //     }
                // });

            }
            $scope.backToDefault = function () {
                $scope.editMode = false;

            }

        }]
    }
    /*Метод-фабрика для директивы*/
})






