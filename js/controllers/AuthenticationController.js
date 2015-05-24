app.controller('AuthenticationController', function (
    $scope, $routeParams, $location ,userService, profileService, credentialsService, notificationService) {

    $scope.register = function (registerData) {
        userService.Register(registerData,
            function(serverData) {
                notificationService.showInfoMessage('Registration Successful.');
                credentialsService.setSessionToken(serverData['access_token']);
                credentialsService.setUsername(serverData['userName']);
                credentialsService.refreshProfileData();
                $location.path('/news-feed');
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.login = function (loginData) {
        userService.Login(loginData,
            function(serverData) {
                notificationService.showInfoMessage('Login Successful.');
                credentialsService.setSessionToken(serverData['access_token']);
                credentialsService.setUsername(serverData['userName']);
                credentialsService.refreshProfileData();
                $location.path('/news-feed');
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };
});