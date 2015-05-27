app.controller('MainController', function (
    $scope, $routeParams,$route, $location ,userService, postService,
    profileService,commentService, credentialsService, notificationService) {

    if (!credentialsService.isLogged()) {
        $location.path('/');
        return 0;
    }
    $scope.posts = {};

    //Dynamic Scrolling
    window.onscroll = function(){
        if (document.body.scrollHeight - window.scrollY  <= window.innerHeight){
            var lastElementNum = Object.keys($scope.posts).pop();
            if ($location.path() === '/news-feed') {
                loadNewsFeedPage($scope.posts[lastElementNum].id, 5, lastElementNum);
            } else{
                loadWallPage($routeParams.username, $scope.posts[lastElementNum].id, 5, lastElementNum);
                loadUserData($routeParams.username);
                if (credentialsService.getUsername() === $routeParams.username) {
                    loadMyTopFriendsList();
                } else {
                    loadTopFriendsList($routeParams.username);
                }
            }
        } 
    };

    //Auto - Function calls

    //Load News-feed page
    if ($location.path() === '/news-feed') {
        loadNewsFeedPage();
    }
    function loadNewsFeedPage(startPostId, pageSize, lastElementNum) {
        if (!lastElementNum) {
            lastElementNum = 0;
        }
        profileService.getNewsFeed(startPostId, pageSize,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                for (var post in serverData) {
                    var position = (Number(post) + Number(lastElementNum) + 1);
                    $scope.posts[position] = serverData[post];
                }
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

    function loadWallPage(username, startPostId, pageSize, lastElementNum) {
        if (!lastElementNum) {
            lastElementNum = 0;
        }
        userService.getUserWall(username, startPostId, pageSize,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                for (var post in serverData) {
                    var position = (Number(post) + Number(lastElementNum) + 1);
                    $scope.posts[position] = serverData[post];
                }
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
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.likePost = function (postKey, postId) {
        postService.likePost(postId,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.posts[postKey].likesCount += 1;
                $scope.posts[postKey].liked = true;
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };
    $scope.unlikePost = function (postKey, postId) {
        postService.unlikePost(postId,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.posts[postKey].likesCount -= 1;
                $scope.posts[postKey].liked = false;
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.addNewComment = function (postKey, postId, content) {
        commentService.addNewComment(postId, {commentContent: content},{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.showCommentInput = false;
                $scope.posts[postKey].comments.unshift(serverData);
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
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.likeComment = function (postKey,commentKey, postId, commentId) {
        commentService.likeComment(postId, commentId,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.posts[postKey].comments[commentKey].likesCount += 1;
                $scope.posts[postKey].comments[commentKey].liked = true;
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.unlikeComment = function (postKey,commentKey, postId, commentId) {
        commentService.unlikeComment(postId, commentId,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.posts[postKey].comments[commentKey].likesCount -= 1;
                $scope.posts[postKey].comments[commentKey].liked = false;
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    // Utils
    $scope.hideElement = function (id) {
        document.getElementById(id).style.display = 'none';
    };

    function RefreshData(startPostId, pageSize) {
        if ($location.path() === '/news-feed') {
            loadNewsFeedPage(startPostId, pageSize);
        } else{
            loadWallPage($routeParams.username)
        }
    }
});