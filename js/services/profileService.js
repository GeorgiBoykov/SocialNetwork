app.factory('profileService', function ($http, baseUrl) {
    var serviceUrl =  baseUrl + 'me';

    function getNewsFeed(headers, success, error) {
        return $http.get(serviceUrl + '/feed?StartPostId=&PageSize=5', {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    function getFriendsList(headers, success, error) {
        return $http.get(serviceUrl + '/friends', {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    function getProfile(headers, success, error) {
        return $http.get(serviceUrl, {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    function editProfile(profileData, headers,success, error) {
        return $http.put(serviceUrl, profileData, {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    return {
        getNewsFeed : getNewsFeed,
        getFriendsList : getFriendsList,
        getProfile : getProfile,
        editProfile : editProfile
    }
});