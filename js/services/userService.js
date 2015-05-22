app.factory('userService', function ($http, baseUrl) {
    var serviceUrl = baseUrl + 'users';

    function Register(registerData, success, error) {
        return $http.post(serviceUrl + '/Register', registerData)
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }
    function Login(loginData, success, error) {
        return $http.post(serviceUrl + '/Login', loginData)
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }
    function Logout(headers, success, error) {
        return $http.post(serviceUrl + '/Logout',{}, {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    function getUserProfile(username, headers, success, error) {
        $http.get(serviceUrl + '/' + username, {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    function getUserWall(username, headers, success, error) {
        return $http.get(serviceUrl + '/'+username+'/wall?StartPostId=&PageSize=5', {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }
    return {
        Register : Register,
        Login : Login,
        Logout : Logout,
        getUserProfile: getUserProfile,
        getUserWall : getUserWall
    }
});