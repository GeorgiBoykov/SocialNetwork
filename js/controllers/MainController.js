app.controller('MainController', function (
    $scope, $routeParams,$route, $location ,userService, postService,
    profileService,commentService, credentialsService, notificationService) {

    if (!credentialsService.isLogged()) {
        $location.path('/');
        return 0;
    }

    $scope.showCommentInput = false;
    $scope.showPostTopLikes = false;

    //Auto - Function calls

    //Load News-feed page
    if ($location.path() === '/news-feed') {
        loadNewsFeedPage();
    }
    function loadNewsFeedPage() {
        profileService.getNewsFeed({Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.posts = serverData;
                loadMyTopFriendsList();
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    }
    //--end

    // Load wall page
    if ($location.path() === '/users/' + $routeParams.username + '/wall') {
        loadWallPage($routeParams.username);
        loadUserData($routeParams.username);
        if (credentialsService.getUsername() === $routeParams.username) {
            loadMyTopFriendsList();
        } else {
            loadTopFriendsList($routeParams.username);
        }
    }

    function loadWallPage(username) {
        userService.getUserWall(username, {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.posts = serverData;
                console.log(serverData);
                $scope.username = username;
                $scope.isCurrentUser = credentialsService.getUsername() === username;
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    }

    function loadUserData(username) {
        userService.getUserProfile(username, {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.userData = serverData;
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    }
    //--end

    //Load top friends
    function loadTopFriendsList(username) {
        userService.getTopFriendsList(username, {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.topFriends = serverData;
                $scope.username = username;
            },
            function (serverError) {
                //notificationService.showErrorMessage(JSON.stringify(serverError));
                $scope.friendsError = serverError;
            });
    }

    function loadMyTopFriendsList() {
        profileService.getMyTopFriendsList({Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.topFriends = serverData;
                $scope.username = credentialsService.getUsername();
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    }
    //--end



    //Event - Handlers

    $scope.addFriend = function (username) {
        profileService.sendFriendRequest(username, {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                document.getElementById('add-friend-btn').disabled = true;
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.addNewPost = function (content, username) {
        postService.addNewPost({postContent: content, username: username},{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                if ($routeParams.username === credentialsService.getUsername()) {
                    document.getElementById('newPostInput').value = '';
                } else {
                    document.getElementById('newFriendPostInput').value = '';
                }

                RefreshData();
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.getPostTopLikes = function (postId) {
        document.getElementById(postId).style.display = 'block';
        postService.getPostTopLikes(postId,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.postTopLikes = serverData;
                console.log(serverData);
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.likePost = function (postId) {
        postService.likePost(postId,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                RefreshData();
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };
    $scope.unlikePost = function (postId) {
        postService.unlikePost(postId,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                RefreshData();
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.addNewComment = function (postId, content) {
        commentService.addNewComment(postId, {commentContent: content},{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                document.getElementById('newCommentInput').value = '';
                RefreshData();
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.getCommentTopLikes = function (postId, commentId) {
        document.getElementById(commentId).style.display = 'block';
        commentService.getCommentTopLikes(postId, commentId,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.commentTopLikes = serverData;
                console.log(serverData);
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.likeComment = function (postId, commentId) {
        commentService.likeComment(postId, commentId,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                RefreshData();
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.unlikeComment = function (postId, commentId) {
        commentService.unlikeComment(postId, commentId,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                RefreshData();
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    // Utils
    $scope.hideElement = function (id) {
        document.getElementById(id).style.display = 'none';
    };

    function RefreshData() {
        if ($location.path() === '/news-feed') {
            loadNewsFeedPage();
        } else{
            loadWallPage($routeParams.username)
        }
    }
});