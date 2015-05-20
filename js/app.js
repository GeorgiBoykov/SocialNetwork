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
        .otherwise({
            redirectTo: '/'
        })

}]);

