app.controller('MainController', function (
    $scope, $routeParams,$route, $location ,userService, postService,
    profileService,commentService, credentialsService, notificationService) {

    if (!credentialsService.isLogged()) {
        $location.path('/');
        return 0;
    }

    $scope.showCommentInput = false;

    //Auto - Function calls

    //Load Friends list
    if ($location.path() === '/users/' + $routeParams.username + '/friends') {
        console.log('Friends loaded');
        if ($routeParams.username === credentialsService.getUsername()) {
            loadMyFriendsList();
        }
        else {
            loadFriendsList($routeParams.username);
        }
    }

    function loadFriendsList(username) {
        userService.getFriendsList(username, {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.friends = serverData;
                loadUserData($routeParams.username);
                console.log(serverData);
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    }

    function loadMyFriendsList() {
        profileService.getMyFriendsList({Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.friends = serverData;
                $scope.userData ={name : credentialsService.getName()};
                console.log(serverData);
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    }

    function loadTopFriendsList(username) {
        userService.getTopFriendsList(username, {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.topFriends = serverData;
                $scope.username = username;
                console.log(serverData);
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    }
    function loadMyTopFriendsList() {
        profileService.getMyTopFriendsList({Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.topFriends = serverData;
                $scope.username = credentialsService.getUsername();
                console.log(serverData);
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    }
    //--end

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
        console.log('Wall loaded');
        loadWallPage($routeParams.username);
        loadUserData($routeParams.username);
        if (credentialsService.getUsername() === $routeParams.username) {
            loadMyTopFriendsList();
        } else{
            loadTopFriendsList($routeParams.username);
        }
    }
    function loadWallPage(username) {
        userService.getUserWall(username, {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.posts = serverData;
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

    //Event - Handlers
    $scope.editProfile = function (data) {
        profileService.editProfile(data, {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                credentialsService.refreshProfileData();
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

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

    $scope.likePost = function (postId) {
        postService.likePost(postId,{Authorization: credentialsService.getSessionToken()},
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

    $scope.likeComment = function (postId, commentId) {
        commentService.likeComment(postId, commentId,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                RefreshData();
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    function RefreshData() {
        if ($location.path() === '/news-feed') {
            loadNewsFeedPage();
        } else{
            loadWallPage($routeParams.username)
        }
    }
});