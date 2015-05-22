app.controller('UserController', function (
    $scope, $rootScope, $location ,userService, credentialsService, notificationService, $routeParams) {
    $scope.register = function (registerData) {
        userService.Register(registerData,
            function(serverData) {
                console.log(serverData);
                notificationService.showInfoMessage('Registration Successful.');
                credentialsService.setSessionToken(serverData['access_token']);
                credentialsService.setUsername(serverData['userName']);
                credentialsService.refreshProfileData();
                $location.path('/news-feed');
            },
            function (serverError) {
                console.log(serverError);
            });
    };

    $scope.login = function (loginData) {
        userService.Login(loginData,
            function(serverData) {
                console.log(serverData);
                notificationService.showInfoMessage('Login Successful.');
                credentialsService.setSessionToken(serverData['access_token']);
                credentialsService.setUsername(serverData['userName']);
                credentialsService.refreshProfileData();
                $location.path('/news-feed');
            },
            function (serverError) {
                console.log(serverError);
            });
    };

    if ($routeParams.username) {
        loadWallPage($routeParams.username);
    }
    function loadWallPage(username) {
        userService.getUserWall(username, {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                console.log(serverData);
                $scope.posts = serverData;
                $scope.username = username;
            },
            function (serverError) {
                console.log(serverError);
            });
    }
});