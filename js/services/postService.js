app.factory('postService', function ($http, baseUrl) {
	var serviceUrl =  baseUrl + 'Posts';

	function addNewPost(postData, headers,success, error) {
	    return $http.post(serviceUrl, postData, {headers: headers})
	        .success(function (data, status, headers, config) {
	            success(data);
	        }).error(error);
	}

	return {
		addNewPost: addNewPost
	}
});