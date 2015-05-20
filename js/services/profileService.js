app.factory('profileService', function ($http, baseUrl) {
    var serviceUrl =  baseUrl + 'me';

    function getNewsFeed(headers, success, error) {
        return $http.get(serviceUrl + '/feed?StartPostId=&PageSize=5', {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }


    return {
        getNewsFeed : getNewsFeed
    }
});