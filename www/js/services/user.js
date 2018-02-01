app.service('user', function($localStorage, $http, $mdToast, $location, $log, CONFIG){
    var cache = null;

    var dashboard = [];

	var addr = CONFIG["host"] + ":" + CONFIG["port"] + "/" + CONFIG["version"] + "/users/";

    this.config = function() {
        return $localStorage["dashboard"];
    }

    this.jwt = function() {
        var token = $localStorage['token'];
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }

    this.auth = function(user) {
        console.log(addr);
        return $http.post(addr + "auth", angular.toJson(user))
        .success(function(data) {
            $localStorage["token"] = data["jwt"];
            
            // TODO: differentiate between config and jwt >> duplicity
            delete $localStorage["dashboard"];
            $localStorage["dashboard"] = data["settings"];
            return;
        })
        .error(function(error, status) {
            console.log(error);
            console.log(status)
            // Let it be handled by controller
            return error;
        })
    }

    this.put = function(data, info) {
        return $http({
            url : addr, 
            method : "PUT",
            data : angular.toJson(data),
            headers : {
                'Authorization' : $localStorage["token"]
            }
            })
            .success(function(data) {
                if (info) {
                    $mdToast.show(
                        $mdToast
                            .simple()
                            .textContent('User settings updated')
                            .position("top right")
                            .hideDelay(3000)
                            .theme("success-toast")
                    );
                }
                return data;        
            })
            .error(function(msg, status) {
            	$log.error('Something went wrong sending user data');
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Something went wrong')
                        .position("top right")
                        .hideDelay(3000)
                        .theme("error-toast")
                );
                console.log(msg);
                return msg;
            })
    }
    
    // Logout user
    // Remove JWT from localStorage and delete session on server
    this.logout = function() {
        var user = $localStorage["token"];

        return $http({
            url : addr + "logout",
            method : "DELETE",
            headers : {
                'Authorization' : $localStorage["token"]
                }
            })
            .success(function(data) {
                $location.path("/login");
                delete $localStorage["token"];
                delete $localStorage["dashboard"];
                delete $localStorage["timestamp"];
                $mdToast.show(
                    $mdToast
                        .simple()
                        .textContent('Logout successfull')
                        .position("top right")
                        .hideDelay(3000)
                );
                return;        
            })
            .error(function(error, msg) {
                $location.path("/login");
                delete $localStorage["token"];
                delete $localStorage["dashboard"];
                delete $localStorage["timestamp"];
                $mdToast.show(
                    $mdToast
                        .simple()
                        .textContent('Logout failed on server side, but you are logged out')
                        .position("top right")
                        .hideDelay(3000)
                );
            });
    }

    this.get = function(allusers) {
        var user = $localStorage["token"];
        
        if (allusers) {
            return $http({
                url : addr,
                method : "GET",
                headers : {
                    'Authorization' : user
                }
            })
            .success(function(data_raw) {
                console.log(data_raw)
                return data_raw;
            })
            .error(function(error, msg) {
                $mdToast.show(
                    $mdToast
                        .simplet()
                        .textContent("Cannot fetch users from database")
                        .position("top right")
                        .hideDelay(3000)
                        .theme("error-toast")
                )
            });
        }

        return this.jwt();
    }


    this.post = function(userData) {
        var user = $localStorage["token"];
        
        return $http({
            url : addr,
            method : "POST",
            data : angular.toJson(userData),
            headers : {
                'Authorization' : user
            }
        })
        .success(function(data) {
            return data;
        })
        .error(function(error, msg) {
            $mdToast.show(
                $mdToast
                    .simplet()
                    .textContent("Cannot create user")
                    .position("top right")
                    .hideDelay(3000)
                    .theme("error-toast")
            )
        });
    }

     this.delete = function(userId) {
        var user = $localStorage["token"];
        console.log(userId)
        
        return $http({
            url : addr,
            method : "DELETE",
            params : {"userId" : userId},
            headers : {
                'Authorization' : user
            }
        })
        .success(function(data) {
            return data;
        })
        .error(function(error, msg) {
            $mdToast.show(
                $mdToast
                    .simplet()
                    .textContent("Cannot delete user")
                    .position("top right")
                    .hideDelay(3000)
                    .theme("error-toast")
            )
        });
    }



});
