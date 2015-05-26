app.controller('FriendsController', function (
    $scope, $routeParams, $location ,userService,
    profileService, credentialsService, notificationService) {

    if (!credentialsService.isLogged()) {
        $location.path('/');
        return 0;
    }

    if ($routeParams.username === credentialsService.getUsername()) {
        loadMyFriendsList();
    }
    else {
        loadFriendsList($routeParams.username);
    }

    function loadFriendsList(username) {
        userService.getFriendsList(username, {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.friends = serverData;
                // Get the name of the user:
                userService.getUserProfile(username, {Authorization: credentialsService.getSessionToken()},
                    function(serverData) {
                        console.log(serverData);
                        $scope.userData = serverData;
                    },
                    function (serverError) {
                        notificationService.showErrorMessage(JSON.stringify(serverError));
                    });
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    }

    function loadMyFriendsList() {
        profileService.getMyFriendsList({Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.friends = serverData;
                $scope.userData ={name : credentialsService.getName()};
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    }

});