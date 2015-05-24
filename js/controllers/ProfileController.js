app.controller('ProfileController',
    function ($scope, $location, $routeParams, credentialsService, notificationService, profileService) {

        if ($location.path() === '/news-feed') {
            loadNewsFeedPage();
        }
        function loadNewsFeedPage() {
            profileService.getNewsFeed({Authorization: credentialsService.getSessionToken()},
                function(serverData) {
                    $scope.posts = serverData;
                },
                function (serverError) {
                    notificationService.showErrorMessage(JSON.stringify(serverError));
                });
        }

        $scope.editProfile = function (data) {
            profileService.editProfile(data, {Authorization: credentialsService.getSessionToken()},
                function(serverData) {
                    credentialsService.refreshProfileData();
                },
                function (serverError) {
                    notificationService.showErrorMessage(JSON.stringify(serverError));
                });
        }
});