var app = angular.module('SocialNetwork', ['ngRoute']);

app.constant('baseUrl',
    'http://softuni-social-network.azurewebsites.net/api/'
);

app.config(['$routeProvider', function (routeProvider) {
    routeProvider
        .when('/', {
            templateUrl: 'partials/authentication.html',
            controller: 'AuthenticationController'
        })
        .when('/news-feed', {
            templateUrl: 'partials/news-feed.html',
            controller: 'MainController'
        })
        .when('/users/:username', {
            templateUrl: 'partials/wall.html',
            controller: 'MainController'
        })
        .when('/users/:username/friends', {
            templateUrl: 'partials/all-friends.html',
            controller: 'FriendsController'
        })
        .when('/profile', {
            templateUrl: 'partials/profile-settings.html',
            controller: 'ProfileController'
        })
        .when('/profile/password', {
            templateUrl: 'partials/change-password.html',
            controller: 'ProfileController'
        })
        .otherwise({
            redirectTo: '/'
        })

}]);

