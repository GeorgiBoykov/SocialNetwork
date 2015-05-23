app.controller('NavBarController', function (
    $scope, $rootScope, $location, userService, credentialsService, profileService, notificationService) {

    $scope.showRequests = false;
    $scope.showSearches = false;

    $rootScope.credentialsService = credentialsService;
    if (credentialsService.isLogged()) {
        credentialsService.refreshProfileData();
    }

    setInterval(function () {
        if (credentialsService.isLogged()) {
            getFriendRequests();
        }
    }, 3000);
    function getFriendRequests() {
        profileService.getFriendRequests({Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.friendRequests = serverData;
            },
            function (serverError) {
                console.log(serverError);
            });
    }

    $scope.respondFriendRequest = function (requestId, status) {
        profileService.respondFriendRequest(requestId,status,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                console.log(serverData);
            },
            function (serverError) {
                console.log(serverError);
            });
    };

    $scope.searchForUser = function (searchTerm) {
        if (searchTerm) {
            $scope.showSearches = true;
            userService.searchForUser(searchTerm,{Authorization: credentialsService.getSessionToken()},
                function(serverData) {
                    $scope.searchResults = serverData;
                },
                function (serverError) {
                    console.log(serverError);
                });
        }
        else{
            $scope.showSearches = false;
        }
    };
    $scope.clearSearchBox = function () {
        document.getElementById('searchBox').value = '';
        $scope.showSearches = false;
    };

    $scope.logout = function () {
        userService.Logout({Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                notificationService.showInfoMessage('Logout Successful.');
                credentialsService.clearCredentials();
                $location.path('/');
            },
            function (serverError) {
                console.log(serverError);
            });
    };

});