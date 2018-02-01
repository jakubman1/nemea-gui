app.directive("sidebarMenu", function() {
	return {
        scope: {
			section: '='
		},
		templateUrl: 'partials/sidebar-menu.html',
        controller: function($scope, $mdSidenav, $mdDialog, $location, MENU, user, dashboard) {
            $scope.menu = MENU;

            $scope.dashboards = dashboard.getAll();
            $scope.selectedDashboard = dashboard.active();

            $scope.isActive = function(current) {
                return('#' + $location.path() == current);
            }   

            $scope.enable = true;

            $scope.toggleItem = function() {
                $scope.toggleBtn = "toggled";
            };


            $scope.closeLeft = function() {
                $mdSidenav('left').toggle();
            };

            $scope.logout = function() {
                dashboard.reset();
                user.logout();
            }

            $scope.addDashboard = function(ev) {
                console.log("Adding new dashboard");

                $mdDialog.show({
                    controller: 'addDashboardController',
                    templateUrl: 'partials/addDashboard.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: true,
                })
                .then(function(answer) {
                    var newIndex = dashboard.add(answer);
                    //console.log(newIndex)
                    dashboard.save();
                    $scope.$emit('switchDashboard', newIndex);
                    $scope.selectedDashboard = dashboard.active(newIndex);
                    /*dashboard.switch(newIndex);
                    $scope.selectedDashboard = newIndex;
                    $scope.$broadcast('reloadDashboard'); */
                }, function() { // cancel
                });
                
            }
                
            /*function() {
                //$scope.$emit('addDashboard');
            }*/

            $scope.switchDashboard = function(index) {
                $scope.selectedDashboard = dashboard.active(index);
                $scope.$emit('switchDashboard', index);
            }

            $scope.$on('switchDashboard', function() {
                console.log("switching");
                $scope.selectedDashboard = dashboard.active();
            })
    
 
        }
	};
});

app.directive("topbarMenu", function() {
	return {
		scope: {
			section: '='
		},
		templateUrl: 'partials/topbar-menu.html',
        controller : function($scope, $mdSidenav) {
            $scope.toggleLeft = function() {
                $mdSidenav('left').toggle();
            }
        }
	};
});


app.directive("boxes", function() {
	return {
		scope: {
			section: '='
		},
		templateUrl: 'partials/boxes.html'
	};
});


