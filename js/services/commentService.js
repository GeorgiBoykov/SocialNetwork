app.factory('commentService', function ($http, baseUrl) {
    var serviceUrl =  baseUrl + 'posts';

    function getCommentsByPostId(postId, headers, success, error) {
        return $http.get(serviceUrl + '/' + postId + '/comments', {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    function addNewComment(postId, commentData, headers, success, error) {
        return $http.post(serviceUrl + '/' + postId + '/comments', commentData, {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    function editComment(postId, commentId, commentContent, headers,success, error) {
        return $http.put(serviceUrl + '/' + postId + '/comments/'+commentId, {commentContent:commentContent}, {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    function deleteComment(postId, commentId, headers,success, error) {
        return $http.delete(serviceUrl + '/' + postId + '/comments/'+commentId, {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    function getCommentTopLikes(postId, commentId, headers, success, error) {
        return $http.get(serviceUrl + '/'+ postId+ '/comments/' + commentId + '/likes/preview', {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    function getCommentAllLikes(postId, commentId, headers, success, error) {
        return $http.get(serviceUrl + '/'+ postId+ '/comments/' + commentId + '/likes', {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    function likeComment(postId, commentId, headers, success, error) {
        return $http.post(serviceUrl + '/'+ postId+ '/comments/' + commentId + '/likes', {}, {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    function unlikeComment(postId, commentId, headers, success, error) {
        return $http.delete(serviceUrl + '/'+ postId+ '/comments/' + commentId + '/likes', {headers: headers})
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    }

    return {
        getCommentsByPostId: getCommentsByPostId,
        addNewComment: addNewComment,
        editComment: editComment,
        deleteComment: deleteComment,
        getCommentTopLikes: getCommentTopLikes,
        getCommentAllLikes: getCommentAllLikes,
        likeComment: likeComment,
        unlikeComment: unlikeComment
    }
});