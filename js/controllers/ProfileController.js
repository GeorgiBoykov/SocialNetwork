app.controller('ProfileController', function ($scope, credentialsService, profileService) {

    loadNewsFeedPage();
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
});