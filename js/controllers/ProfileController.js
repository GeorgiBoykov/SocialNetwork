app.controller('ProfileController', function (
    $scope, $location, profileService, credentialsService, notificationService) {

    if (!credentialsService.isLogged()) {
        $location.path('/');
        return 0;
    }

    $scope.editProfile = function (data) {
        var newProfileData = {};

        if (data.name) {
            newProfileData['name'] = data.name;
        } else newProfileData.name = credentialsService.getName();

        if (data.email) {
            newProfileData['email'] = data.email;
        } else newProfileData.email = credentialsService.getEmail();

        if (data.gender) {
            newProfileData['gender'] = data.gender;
        }
        if (data.profileImageData) {
            if (data.profileImageData.size > 131072) {
              return notificationService.showErrorMessage('Profile image size cannot be more than 128kb')
            }
            newProfileData['profileImageData'] = data.profileImageData.src;
        } else newProfileData.profileImageData = credentialsService.getProfileImage();

        if (data.coverImageData) {
            if (data.coverImageData.size > 1048576) {
                return notificationService.showErrorMessage('Cover image size cannot be more than 1024kb')
            }
            newProfileData['coverImageData'] = data.coverImageData.src;
        } else newProfileData.coverImageData = credentialsService.getCoverImage();

        profileService.editProfile(newProfileData, {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                credentialsService.refreshProfileData();
                notificationService.showInfoMessage('Profile updated successfully');
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.changePassword = function (data) {

        if (!data.oldPassword) {
            return notificationService.showErrorMessage('Missing old password..');
        }
        if (data.oldPassword.length < 6 || data.oldPassword.length > 100) {
            return notificationService.showErrorMessage('Old password should be between 6 and 100 characters long');
        }
        if (data.newPassword.length < 6 || data.newPassword.length > 100) {
            return notificationService.showErrorMessage('New password should be between 6 and 100 characters long');
        }
        if (!data.confirmPassword) {
            return notificationService.showErrorMessage('Missing password repeat..');
        }
        if (data.confirmPassword != data.newPassword) {
            return notificationService.showErrorMessage('Passwords doesn`t match..');
        }

        profileService.changePassword(data, {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                credentialsService.refreshProfileData();
                notificationService.showInfoMessage('Password changed successfully');
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

});