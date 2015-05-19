app.controller('AuthenticationController', function (
    $scope, $rootScope, $location, authenticationService, credentialsService, notificationService) {

    $scope.register = function (registerData) {
        authenticationService.Register(registerData,
            function(serverData) {
                console.log(serverData);
                notificationService.showInfoMessage('Registration Successful.')
                credentialsService.setSessionToken(serverData['access_token'])
                credentialsService.setUsername(serverData['userName'])
                $location.path('/news-feed');
            },
            function (serverError) {
                console.log(serverError);
            });
    };

    $scope.login = function (loginData) {
        authenticationService.Login(loginData,
            function(serverData) {
                console.log(serverData);
                notificationService.showInfoMessage('Login Successful.')
                $rootScope.logged = true;
                credentialsService.setSessionToken(serverData['access_token']);
                credentialsService.setUsername(serverData['userName']);
                $location.path('/news-feed');
            },
            function (serverError) {
                console.log(serverError);
            });
    };
});