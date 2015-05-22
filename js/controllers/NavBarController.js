app.controller('NavBarController', function (
    $scope, $rootScope, $location, userService, credentialsService, profileService,notificationService) {

    $rootScope.credentialsService = credentialsService;

    if (credentialsService.isLogged()) {
        credentialsService.refreshProfileData();
    }

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
    }

});