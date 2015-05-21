app.controller('NavBarController', function (
    $scope, $rootScope, $location, userService, credentialsService, profileService, notificationService) {

    if (sessionStorage['sessionToken']) {
        $rootScope.logged = true;
    } else {
        $rootScope.logged = false;
    }

    getProfileData();
    function getProfileData() {
        profileService.getProfile({Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                console.log(serverData);
                $scope.profile = serverData;
            },
            function (serverError) {
                console.log(serverError);
            });
    }

    $scope.logout = function () {
        userService.Logout({Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                notificationService.showInfoMessage('Logout Successful.');
                $rootScope.logged = false;
                credentialsService.clearCredentials();
                $location.path('/');

            },
            function (serverError) {
                console.log(serverError);
            });
    }
});