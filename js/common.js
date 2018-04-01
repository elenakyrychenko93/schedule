let scheduleApp = angular.module("scheduleApp", [])
    .controller('scheduleController', function ($scope) {

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
                // console.log($scope.schedule);
                // $scope.schedule.push(...data);
                $scope.$apply();



                // $scope.databaseInfo = {
                //     StartTime : data.schedule.StartTime,
                //     EndTime : data.schedule.EndTime,
                //     Description : data.schedule.Description
                //
                // };
                //
                // $scope.schedule.push($scope.databaseInfo);
                // console.log($scope.schedule);
                // $scope.$apply()
            }


        });

        $scope.addAction = function () {

            $scope.formIn = {
                StartTime: $scope.formInfo.StartTime,
                EndTime: $scope.formInfo.EndTime,
                Description: $scope.formInfo.Description
            };

            $.ajax({
                type: "post",
                url: "https://articles-cdc1a.firebaseio.com/schedule-list.json",
                data: JSON.stringify($scope.formIn),
                success: function (data) {
                    console.log(data.name);
                    $scope.formIn.id = data.name;
                    $scope.schedule.push($scope.formIn);
                    $scope.$apply()

                    // let form = document.getElementById('updateForm');

                    // $scope.schedule = $scope.schedule.filter(i => i._id !== article._id);
                    // $scope.$apply()
                }
            });

        };





    })
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
<div class="tr edit" ng-if="editMode == true">
                   <div class="td"><input ng-model="action.StartTime" type="time"></div>
                    <div class="td"><input ng-model="action.EndTime" type="time"></div>
                    <div class="td"><input ng-model="action.Description" type="text">
                    
                    <button class="update" ng-click="backToDefault()"><i class="fa fa-times" aria-hidden="true"></i></i></button>
                    <button class="update" ng-click="saveAction()"><i class="fa fa-floppy-o" aria-hidden="true"></i></button>
                 </div>
              </div>`,

        link: function($scope, element, attrs) {
            // console.log($scope.action);
            $scope.editMode = false;
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
                console.log($scope.action.StartTime);

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
        }
    }
    /*Метод-фабрика для директивы*/
})
// myModule.component('myComponent', {
//     template: '<h1>Hello {{ $ctrl.getFullName() }}</h1>',
//     bindings: {
//         firstName: '<',
//         lastName: '<'
//     },
//     controller: function() {
//         this.getFullName = function() {
//             return this.firstName + ' ' + this.lastName;
//         };
//     }
// });
// .component('trAction', {
//     bindings: {
//         data: '='
//     },
//     template: [
//
//         '<div class="container">',
//         '<h1 ng-bind="$ctrl.data.title"></h1>',
//         '<ul>',
//         '<li ng-repeat="item in $ctrl.data.list track by $id(item)" ng-bind="item"></li>',
//         '</ul>',
//         '</div>'
//     ].join('')
// });





