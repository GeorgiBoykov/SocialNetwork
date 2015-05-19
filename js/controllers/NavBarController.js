app.controller('NavBarController', function (
    $scope, $rootScope, authenticationService, credentialsService, notificationService) {

    if (sessionStorage['sessionToken']) {
        $rootScope.logged = true;
    } else {
        $rootScope.logged = false;
    }

    $scope.username = credentialsService.getUsername();

    $scope.logout = function () {
        authenticationService.Logout({Authorization: credentialsService.getSessionToken()},
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