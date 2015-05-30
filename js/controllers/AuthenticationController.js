app.controller('AuthenticationController', function (
    $scope, $routeParams, $location ,userService, profileService, credentialsService, notificationService) {

    $scope.register = function (registerData) {
        if (!registerData.username) {
            return notificationService.showErrorMessage('Missing username..');
        }
        if (!registerData.password) {
            return notificationService.showErrorMessage('Missing password..');
        }
        if (registerData.password.length < 6 || registerData.password.length > 100) {
            return notificationService.showErrorMessage('Password should be between 6 and 100 characters long');
        }
        if (!registerData.confirmPassword) {
            return notificationService.showErrorMessage('Missing password repeat..');
        }
        if (registerData.confirmPassword != registerData.password) {
            return notificationService.showErrorMessage('Passwords doesn`t match..');
        }
        if (!registerData.name) {
            return notificationService.showErrorMessage('Missing full name..');
        }
        if (!registerData.email) {
            return notificationService.showErrorMessage('Missing email..');
        }
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
        if (!loginData.username || !loginData.password) {
            return notificationService.showErrorMessage('Missing login name or password..');
        }
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