app.factory('commentService', function ($http, baseUrl) {
    var serviceUrl =  baseUrl + 'posts';

    function addNewComment(postId, commentData, headers, success, error) {
        return $http.post(serviceUrl + '/' + postId + '/comments', commentData, {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    return {
        addNewComment: addNewComment
    }
});