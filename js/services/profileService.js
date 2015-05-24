app.factory('profileService', function ($http, $q, baseUrl, credentialsService) {
    var serviceUrl =  baseUrl + 'me';

    function getNewsFeed(headers, success, error) {
        return $http.get(serviceUrl + '/feed?StartPostId=&PageSize=5', {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    function getProfile(headers, success, error) {
        $http.get(serviceUrl, {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    function editProfile(data, headers,success, error) {
        var profileData = {};

        if (data.name) {
          profileData['name'] = data.name;
        } else profileData.name = credentialsService.getName();

        if (data.email) {
          profileData['email'] = data.email;
        } else profileData.email = credentialsService.getEmail();

        if (data.gender) {
          profileData['gender'] = data.gender;
        }
        if (data.profileImageData) {
          profileData['profileImageData'] = data.profileImageData;
        } else profileData.profileImageData = credentialsService.getProfileImage();

        if (data.coverImageData) {
          profileData['coverImageData'] = data.coverImageData;
        } else profileData.coverImageData = credentialsService.getCoverImage();

        return $http.put(serviceUrl, profileData, {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }
    function getMyFriendsList(headers, success, error) {
        return $http.get(serviceUrl +'/friends', {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    function getFriendRequests(headers, success, error) {
        return $http.get(serviceUrl + '/requests', {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    function sendFriendRequest(username, headers, success, error) {
        return $http.post(serviceUrl + '/requests/'+username, {}, {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    function respondFriendRequest(requestId, status ,headers, success, error) {
        return $http.put(serviceUrl + '/requests/'+requestId+'?status='+status, {}, {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    return {
        getNewsFeed : getNewsFeed,
        getProfile : getProfile,
        editProfile : editProfile,
        getMyFriendsList: getMyFriendsList,
        getFriendRequests: getFriendRequests,
        sendFriendRequest: sendFriendRequest,
        respondFriendRequest: respondFriendRequest
    }
});