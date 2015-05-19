app.controller('NavBarController', function (
    $scope, $rootScope, userService, credentialsService, notificationService) {

    $scope.username = credentialsService.getUsername();

    if (sessionStorage['sessionToken']) {
        $rootScope.logged = true;
    } else {
        $rootScope.logged = false;
    }


    $scope.logout = function () {
        userService.Logout({Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                console.log(serverData);
                notificationService.showInfoMessage('Logout Successful.')
                $rootScope.logged = false;
                credentialsService.clearCredentials();
            },
            function (serverError) {
                console.log(serverError);
            });
    }
});