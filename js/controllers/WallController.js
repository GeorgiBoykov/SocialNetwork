app.controller('WallController',
    function ($scope,$routeParams, postService, userService, profileService, credentialsService) {

    if ($routeParams.username ) {
        loadWallPage($routeParams.username);
        loadUserData($routeParams.username);
        console.log(1);
    }
    function loadWallPage(username) {
        userService.getUserWall(username, {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                console.log(serverData);
                $scope.posts = serverData;
                $scope.username = username;
                $scope.isCurrentUser = credentialsService.getUsername() === username;
            },
            function (serverError) {
                console.log(serverError);
            });
    }

    function loadUserData(username) {
        userService.getUserProfile(username, {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.userData = serverData;
            },
            function (serverError) {
                console.log(serverError);
            });
    }

    $scope.addNewPost = function (content) {
        postService.addNewPost({postContent: content, username: credentialsService.getUsername()},{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                console.log(serverData);
            },
            function (serverError) {
                console.log(serverError);
            });
    };

    $scope.addFriend = function (username) {
        profileService.sendFriendRequest(username, {Authorization: credentialsService.getSessionToken()},
        function(serverData) {
            console.log(serverData);
        },
        function (serverError) {
            console.log(serverError);
        });
    }
});