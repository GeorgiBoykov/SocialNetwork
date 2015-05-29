app.controller('ProfileController', function (
    $scope, $location, profileService, credentialsService, notificationService) {

    if (!credentialsService.isLogged()) {
        $location.path('/');
        return 0;
    }

    $scope.editProfile = function (data) {
        profileService.editProfile(data, {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                credentialsService.refreshProfileData();
                notificationService.showInfoMessage('Profile updated successufly')
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.changePassword = function (data) {
        profileService.changePassword(data, {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                credentialsService.refreshProfileData();
                notificationService.showInfoMessage('Password changed successufly')
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

});