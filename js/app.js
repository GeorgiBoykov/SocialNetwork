var app = angular.module('SocialNetwork', ['ngRoute']);

app.constant('baseUrl',
    'http://softuni-social-network.azurewebsites.net/api/'
);
app.constant('anonymousImage',
    'data:image/png;base64,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'
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
        .when('/users/:username/wall', {
            templateUrl: 'partials/wall.html',
            controller: 'MainController'
        })
        .when('/users/:username/friends', {
            templateUrl: 'partials/all-friends.html',
            controller: 'FriendsController'
        })
        .when('/profile-settings', {
            templateUrl: 'partials/profile-settings.html',
            controller: 'ProfileController'
        })
        .when('/change-password', {
            templateUrl: 'partials/change-password.html',
            controller: 'ProfileController'
        })
        .otherwise({
            redirectTo: '/'
        })

}]);

