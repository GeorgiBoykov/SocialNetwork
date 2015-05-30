app.factory('credentialsService', function ($http, baseUrl) {

    function getSessionToken() {
        return sessionStorage.getItem('sessionToken');
    }

    function setSessionToken(sessionToken) {
        sessionStorage.setItem('sessionToken', 'Bearer ' + sessionToken);
    }

    function getUsername() {
        return sessionStorage.getItem('username');
    }

    function setUsername(username) {
        sessionStorage.setItem('username', username);
    }

    function getName() {
        return sessionStorage.getItem('name');
    }

    function setName(name) {
        sessionStorage.setItem('name', name);
    }

    function getEmail() {
        return sessionStorage.getItem('email');
    }

    function setEmail(email) {
        sessionStorage.setItem('email', email);
    }

    function getProfileImage() {
        if (sessionStorage.getItem('profileImage')) {
            if (sessionStorage.getItem('profileImage').length > 30) {
                return sessionStorage.getItem('profileImage')
            }
        }

        return null;
    }

    function setProfileImage(profileImage) {
        sessionStorage.setItem('profileImage', profileImage);
    }

    function getCoverImage() {
        return sessionStorage.getItem('coverImage');
    }

    function setCoverImage(coverImage) {
        sessionStorage.setItem('coverImage', coverImage);
    }

    function refreshProfileData() {
        $http.get(baseUrl + 'me', {headers: {Authorization: getSessionToken()}})
            .success(function(serverData) {
                setName(serverData.name);
                setEmail(serverData.email);
                setProfileImage(serverData.profileImageData);
                setCoverImage(serverData.coverImageData);
            }).error(function (serverError) {
                console.log(serverError);
            })
    }

    function isLogged () {
        if (sessionStorage['sessionToken']) {
          return true
        }
        return false ;
    }

    function clearCredentials() {
        sessionStorage.clear();
    }

    return {
        getSessionToken: getSessionToken,
        setSessionToken: setSessionToken,
        getUsername: getUsername,
        setUsername: setUsername,
        getName: getName,
        setName: setName,
        getEmail: getEmail,
        setEmail: setEmail,
        getProfileImage : getProfileImage,
        setProfileImage: setProfileImage,
        getCoverImage: getCoverImage,
        setCoverImage: setCoverImage,
        refreshProfileData: refreshProfileData,
        isLogged : isLogged,
        clearCredentials: clearCredentials
    }
});