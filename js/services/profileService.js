app.factory('profileService', function ($http, $q, baseUrl, credentialsService) {
    var serviceUrl =  baseUrl + 'me';

    function getNewsFeed(startPostId, pageSize, headers, success, error) {
        if (!startPostId) {
            startPostId = '';
        }
        if (!pageSize) {
            pageSize = '5';
        }
        return $http.get(serviceUrl+'/feed?StartPostId='+startPostId+'&PageSize='+pageSize, {headers: headers})
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

    function changePassword(data, headers, success, error) {
        
        return $http.put(serviceUrl + '/ChangePassword', data, {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    function getMyTopFriendsList(headers, success, error) {
        return $http.get(serviceUrl +'/friends/preview', {headers: headers})
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
        changePassword: changePassword,
        getMyFriendsList: getMyFriendsList,
        getMyTopFriendsList: getMyTopFriendsList,
        getFriendRequests: getFriendRequests,
        sendFriendRequest: sendFriendRequest,
        respondFriendRequest: respondFriendRequest
    }
});