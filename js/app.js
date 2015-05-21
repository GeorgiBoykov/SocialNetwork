var app = angular.module('SocialNetwork', ['ngRoute']);

app.constant('baseUrl',
    'http://softuni-social-network.azurewebsites.net/api/'
);

app.config(['$routeProvider', function (routeProvider) {
    routeProvider
        .when('/', {
            templateUrl: 'partials/authentication.html',
            controller: 'UserController'
        })
        .when('/news-feed', {
            templateUrl: 'partials/news-feed.html',
            controller: 'ProfileController'
        })
        .when('/users/:username', {
            templateUrl: 'partials/wall.html',
            controller: 'UserController'
        })
        .when('/users/:username/friends', {
            templateUrl: 'partials/friends-list.html',
            controller: 'ProfileController'
        })
        .when('/profile-settings', {
            templateUrl: 'partials/profile-settings.html',
            controller: 'ProfileController'
        })
        .otherwise({
            redirectTo: '/'
        })

}]);

