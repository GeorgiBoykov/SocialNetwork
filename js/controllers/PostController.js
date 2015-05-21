app.controller('PostController', function ($scope, postService, credentialsService) {
    
    $scope.addNewPost = function (content) {
        postService.addNewPost({postContent: content, username: credentialsService.getUsername()},{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                console.log(serverData);
                $scope.posts = serverData;
            },
            function (serverError) {
                console.log(serverError);
            });
    }
        
});