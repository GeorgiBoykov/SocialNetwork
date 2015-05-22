app.controller('ProfileController',
    function ($scope, $location, $routeParams, credentialsService, profileService) {

        if ($location.path() === '/news-feed') {
            loadNewsFeedPage();
        }
        function loadNewsFeedPage() {
            profileService.getNewsFeed({Authorization: credentialsService.getSessionToken()},
                function(serverData) {
                    console.log(serverData);
                    $scope.posts = serverData;
                },
                function (serverError) {
                    console.log(serverError);
                });
        }

        if ($routeParams.username === credentialsService.getUsername()) {
            loadFriendsList();
        }
        function loadFriendsList() {
            profileService.getFriendsList({Authorization: credentialsService.getSessionToken()},
                function(serverData) {
                    console.log(serverData);
                    $scope.friends = serverData;
                },
                function (serverError) {
                    console.log(serverError);
                });
        }

        $scope.editProfile = function (data) {
            profileService.editProfile(data, {Authorization: credentialsService.getSessionToken()},
                function(serverData) {
                    console.log(serverData);
                    credentialsService.refreshProfileData();
                },
                function (serverError) {
                    console.log(serverError);
                });
        }
});