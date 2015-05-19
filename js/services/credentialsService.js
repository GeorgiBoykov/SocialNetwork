app.factory('credentialsService', function () {

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
        sessionStorage.setItem('fullName', name);
    }

    function getUserId() {
        return sessionStorage.getItem('userId');
    }

    function setUserId(userId) {
        sessionStorage.setItem('userId', userId);
    }

    function clearCredentials() {
        delete sessionStorage.username;
        delete sessionStorage.sessionToken;
        delete sessionStorage.userId;
        delete sessionStorage.name;
    }

    return {
        getSessionToken: getSessionToken,
        setSessionToken: setSessionToken,
        getUsername: getUsername,
        setUsername: setUsername,
        getName: getName,
        setName: setName,
        getUserId: getUserId,
        setUserId: setUserId,
        clearCredentials: clearCredentials
    }
});