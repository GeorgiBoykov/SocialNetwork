app.controller('NavBarController', function ($scope, $rootScope, authenticationService, credentialsService) {

    $scope.logout = function () {
        authenticationService.Logout({Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                console.log(serverData);
                $rootScope.logged = false;
                credentialsService.clearCredentials();
            },
            function (serverError) {
                console.log(serverError);
            });
    }
});