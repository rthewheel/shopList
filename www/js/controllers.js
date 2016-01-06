var shopList = angular.module('shopList', ['ngCordova', 'ngTouch']).
directive('onLongPress', function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, $elm, $attrs) {
                $elm.bind('touchstart', function(evt) {
                    // Locally scoped variable that will keep track of the long press
                    $scope.longPress = true;

                    // We'll set a timeout for 600 ms for a long press
                    $timeout(function() {
                        if ($scope.longPress) {
                            // If the touchend event hasn't fired,
                            // apply the function given in on the element's on-long-press attribute
                            $scope.$apply(function() {
                                $scope.$eval($attrs.onLongPress)
                            });
                        }
                    }, 600);
                });

                $elm.bind('touchend', function(evt) {
                    // Prevent the onLongPress event from firing
                    $scope.longPress = false;
                    // If there is an on-touch-end function attached to this element, apply it
                    if ($attrs.onTouchEnd) {
                        $scope.$apply(function() {
                            $scope.$eval($attrs.onTouchEnd)
                        });
                    }
                });
            }
        };
});

shopList.controller('ItemsListCtrl', function ($scope, $cordovaFile) {
    //Save to localStorage
    //$scope.items = JSON.parse(localStorage['data']);

    document.addEventListener("deviceready", function () {
        $scope.listPath = cordova.file.externalRootDirectory;

        //Save to file
        $cordovaFile.readAsText($scope.listPath, "list.json").then(function(result) {
            $scope.items = JSON.parse(result);
        }, function(err) {
            alert('Error! ' + err + $scope.listPath);
        });
    }, false);


    $scope.add = function(name) {
        var itemObj = {
            'name': name,
            'qty': 1,
            'status': false,
            'priority': 0
        };
        if ($scope.items) {
            $scope.items.push(itemObj);
        } else {
            $scope.items = [];
            $scope.items.push(itemObj);

        }

        $scope.new_item = "";

        var data = JSON.stringify($scope.items);
        //Save to localStorage
        //localStorage.setItem('data', data);

        //Save to file
        $scope.writeFile();
    };

    $scope.delete = function(index) {
        $scope.items.splice(index, 1);
        $scope.writeFile();
    };
    $scope.changeStatus = function(index) {

        $scope.items[index].status = !$scope.items[index].status;
        $scope.writeFile();
    };

    $scope.itemOnLongPress = function(index) {
        $scope.items[index].menu = true;
    };

    $scope.itemOnTouchEnd = function(id) {
    };

    $scope.writeFile = function(){
        var data = JSON.stringify($scope.items);
        $cordovaFile.writeFile($scope.listPath, "list.json", data, true).then(function(result) {
        }, function(err) {
            alert('Error! ' + err + $scope.listPath);
        });
    };
});
