app.factory('postService', function ($http, baseUrl) {
	var serviceUrl =  baseUrl + 'Posts';

	function addNewPost(postData, headers,success, error) {
	    return $http.post(serviceUrl, postData, {headers: headers})
	        .success(function (data, status, headers, config) {
	            success(data);
	        }).error(error);
	}

	function likePost(postId, headers, success, error) {
		return $http.post(serviceUrl + '/'+ postId+ '/likes', {}, {headers: headers})
			.success(function (data, status, headers, config) {
				success(data);
			}).error(error);
	}

	function unlikePost(postId, headers, success, error) {
		return $http.delete(serviceUrl + '/'+ postId+ '/likes', {headers: headers})
			.success(function (data, status, headers, config) {
				success(data);
			}).error(error);
	}

	return {
		addNewPost: addNewPost,
		likePost : likePost,
		unlikePost: unlikePost
	}
});