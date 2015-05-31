app.controller('MainController', function (
    $scope, $routeParams,$route, $location ,userService, postService,
    profileService,commentService, credentialsService, notificationService) {

    if (!credentialsService.isLogged()) {
        $location.path('/');
        return 0;
    }

    $scope.posts = {};
    var DEFAULT_POSTS_PER_PAGE = 5;

    //Sort posts
    $scope.objectKeys = function(obj){
        return Object.keys(obj);
    };

    //Dynamic Scrolling
    window.onscroll = function(){
        if (document.body.scrollHeight - window.scrollY  <= window.innerHeight &&
             $scope.posts[0]){
            var lastElementKey = (Object.keys($scope.posts)).length-1;
            if ($location.path() === '/news-feed') {
                loadNewsFeedPage($scope.posts[lastElementKey].id,
                    DEFAULT_POSTS_PER_PAGE, lastElementKey);
            } else if($location.path() === '/users/' + $routeParams.username + '/wall'){
                loadWallPage($routeParams.username, $scope.posts[lastElementKey].id,
                    DEFAULT_POSTS_PER_PAGE, lastElementKey);
            }
        }
    };

    //Auto - Function calls

    //Load News-feed page
    if ($location.path() === '/news-feed') {
        loadNewsFeedPage();
        loadMyTopFriendsList();
    }
    function loadNewsFeedPage(startPostId, pageSize, lastElementKey) {

        FillProgressBar();
        if (!lastElementKey) {
            lastElementKey = -1;
        }
        profileService.getNewsFeed(startPostId, pageSize,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                for (var postKey in serverData) {
                    var newKey = (Number(postKey) + Number(lastElementKey) + 1);
                    $scope.posts[newKey] = serverData[postKey];
                }
                ClearProgressBar();
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
                if (serverError.message == 'Session token expired or not valid.') {
                    $location.path('/');
                    credentialsService.clearCredentials();
                    return 0;
                }
            });
    }
    //--end

    // Load wall page
    if ($location.path() === '/users/' + $routeParams.username + '/wall') {
        loadWallPage($routeParams.username);
        loadUserData($routeParams.username);
        if (credentialsService.getUsername() === $routeParams.username) {
            loadMyTopFriendsList();
        }
    }

    function loadWallPage(username, startPostId, pageSize, lastElementKey) {

        FillProgressBar();
        if (!lastElementKey) {
            lastElementKey = -1;
        }
        userService.getUserWall(username, startPostId, pageSize,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                for (var postKey in serverData) {
                    var newKey = (Number(postKey) + Number(lastElementKey) + 1);
                    $scope.posts[newKey] = serverData[postKey];
                }
                $scope.username = username;
                $scope.isCurrentUser = credentialsService.getUsername() === username;
                ClearProgressBar();
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
                if (serverError.message == 'Session token expired or not valid.') {
                    $location.path('/');
                    credentialsService.clearCredentials();
                    return 0;
                }
            });
    }

    function loadUserData(username) {
        userService.getUserProfile(username, {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.userData = serverData;
                if (serverData.isFriend == true) {
                    loadTopFriendsList($routeParams.username);
                }
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
                notificationService.showErrorMessage(JSON.stringify(serverError));
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
        if (content.length < 2) {
            return  notificationService.showErrorMessage('Post length should be at least 2 characters long...');
        }
        if (content.length > 500) {
            return  notificationService.showErrorMessage('Post length too long (max: 500 characters)...');
        }
        postService.addNewPost({postContent: content, username: username},{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $route.reload();
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

    $scope.openDeletePostDialog = function (post, postKey, dialog) {
        $scope.showDialog(dialog);
        $scope.postToDelete = {post: post, postKey: postKey};
    };
    $scope.deletePost = function (post, postKey, dialog) {
        $scope.hideDialog(dialog);
        postService.deletePost(post.id,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                delete $scope.posts[postKey];
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

    $scope.getPostAllLikes = function (post, dialog) {
        $scope.showDialog('#post-likes-dialog-window');
        postService.getPostAllLikes(post.id, {Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.postAllLikes = serverData;
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
        if (content.length < 2) {
            return  notificationService.showErrorMessage('Comment length should be at least 2 characters long...');
        }
        if (content.length > 300) {
            return  notificationService.showErrorMessage('Comment length too long (max: 500 characters)...');
        }
        commentService.addNewComment(post.id, {commentContent: content},{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                post.comments.unshift(serverData);
                post.showCommentInput = false;
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.editComment = function (post, comment, commentContent) {
        commentService.editComment(post.id, comment.id, commentContent,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                comment.commentContent = serverData.commentContent;
                comment.showEditCommentInput = false;
            },
            function (serverError) {
                notificationService.showErrorMessage(JSON.stringify(serverError));
            });
    };

    $scope.openDeleteCommentDialog = function (post, comment, postKey, commentKey, dialog) {
        $scope.showDialog(dialog);
        $scope.commentToDelete = {post: post, comment: comment, postKey: postKey, commentKey:commentKey};
    };
    $scope.deleteComment = function(post, comment, postKey, commentKey, dialog) {
        $scope.hideDialog(dialog);

        commentService.deleteComment(post.id,comment.id,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                delete $scope.posts[postKey].comments[commentKey];
                document.getElementById(comment.id).style.display = 'none';
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

    $scope.getCommentAllLikes = function (post, comment, dialog) {
        $scope.showDialog(dialog);
        commentService.getCommentAllLikes(post.id, comment.id,{Authorization: credentialsService.getSessionToken()},
            function(serverData) {
                $scope.commentAllLikes = serverData;
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

    //Utilities
    $scope.showDialog = function (dialog) {
        $(dialog).modal('show');
    };
    $scope.hideDialog = function (dialog) {
        $(dialog).modal('hide');
    };

    function FillProgressBar() {
        setTimeout(function () {
            document.getElementById('posts-progress-bar').style.width = '100%';
        }, 70);
    }

    function ClearProgressBar() {
        document.getElementById('posts-progress-bar').style.width = '0%';
    }

});