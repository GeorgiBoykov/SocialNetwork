app.controller('MainController', function (
    $scope, $routeParams,$route, $location ,userService, postService,
    profileService,commentService, credentialsService, notificationService) {

    if (!credentialsService.isLogged()) {
        $location.path('/');
        return 0;
    }
    $scope.posts = {};
    var _defaultPostsPerPage = 5;
    //Sort posts
    $scope.objectKeys = function(obj){
        return Object.keys(obj);
    };

    //Dynamic Scrolling
    window.onscroll = function(){
        if (document.body.scrollHeight - window.scrollY  <= window.innerHeight){
            var lastElementKey = (Object.keys($scope.posts)).length-1;
            if ($location.path() === '/news-feed') {
                loadNewsFeedPage($scope.posts[lastElementKey].id,
                    _defaultPostsPerPage, lastElementKey);
            } else{
                loadWallPage($routeParams.username, $scope.posts[lastElementKey].id,
                    _defaultPostsPerPage, lastElementKey);
            }
        }
    };

    //Auto - Function calls

    //Load News-feed page
    if ($location.path() === '/news-feed') {
        loadNewsFeedPage();
    }
    function loadNewsFeedPage(startPostId, pageSize, lastElementKey) {
        if (!lastElementKey) {
            lastElementKey = -1;
            $scope.posts = {};
        }
        profileService.getNewsFeed(startPostId, pageSize,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                for (var postKey in serverData) {
                    var newKey = (Number(postKey) + Number(lastElementKey) + 1);
                    $scope.posts[newKey] = serverData[postKey];
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

    function loadWallPage(username, startPostId, pageSize, lastElementKey) {
        if (!lastElementKey) {
            lastElementKey = -1;
            $scope.posts = {};
        }
        userService.getUserWall(username, startPostId, pageSize,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                for (var postKey in serverData) {
                    var newKey = (Number(postKey) + Number(lastElementKey) + 1);
                    $scope.posts[newKey] = serverData[postKey];
                }
                $scope.username = username;
                console.log(Object.keys($scope.posts)[0]-1);
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
                loadWallPage($routeParams.username)
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.editPost = function (post, postContent) {
        postService.editPost(post.id, postContent,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                post.postContent = serverData.content;
                post.showEditPostInput = false;
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.getPostTopLikes = function (post) {
        post.showLikesBalloon = !post.showLikesBalloon;
        postService.getPostTopLikes(post.id, {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.postTopLikes = serverData;
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.likePost = function (post) {
        postService.likePost(post.id,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                post.likesCount += 1;
                post.liked = true;
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };
    $scope.unlikePost = function (post) {
        postService.unlikePost(post.id,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                post.likesCount -= 1;
                post.liked = false;
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.getCommentsByPostId = function (post) {
        commentService.getCommentsByPostId(post.id,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                post.comments = serverData;
                post.hideAppendComments = true;
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.addNewComment = function (post, content) {
        commentService.addNewComment(post.id, {commentContent: content},{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                post.comments.unshift(serverData);
                post.showCommentInput = false;
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.getCommentTopLikes = function (post, comment) {
        comment.showTopLikesBalloon = !comment.showTopLikesBalloon;
        commentService.getCommentTopLikes(post.id, comment.id,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.commentTopLikes = serverData;
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.likeComment = function (post, comment, commentKey) {
        commentService.likeComment(post.id, comment.id,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                post.comments[commentKey].likesCount += 1;
                post.comments[commentKey].liked = true;
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.unlikeComment = function (post, comment, commentKey) {
        commentService.unlikeComment(post.id, comment.id,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                post.comments[commentKey].likesCount -= 1;
                post.comments[commentKey].liked = false;
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

});