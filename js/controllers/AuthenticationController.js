app.controller('AuthenticationController', function ($scope, $rootScope, authenticationService, credentialsService) {

    if (sessionStorage['sessionToken']) {
        $rootScope.logged = true;
    } else {
        $rootScope.logged = false;
    }

    $scope.register = function (registerData) {
        authenticationService.Register(registerData,
            function(serverData) {
                console.log(serverData);
                credentialsService.setSessionToken(serverData['access_token'])
                            },
            function (serverError) {
                console.log(serverError);
            });
    };

    $scope.login = function (loginData) {
        authenticationService.Login(loginData,
            function(serverData) {
                console.log(serverData);
                $rootScope.logged = true;
                credentialsService.setSessionToken(serverData['access_token']);
            },
            function (serverError) {
                console.log(serverError);
            });
    };
});