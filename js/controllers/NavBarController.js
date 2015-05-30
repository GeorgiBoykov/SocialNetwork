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
                notificationService.showErrorMessage(JSON.stringify(serverError));
                if (serverError.message == 'Session token expired or not valid.') {
                    $location.path('/');
                    credentialsService.clearCredentials();
                    return 0;
                }
            });
    }

    $scope.respondFriendRequest = function (requestId, status) {
        profileService.respondFriendRequest(requestId,status,
            {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
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
                    notificationService.showErrorMessage(JSON.stringify(serverError));
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
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

});