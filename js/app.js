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
        .otherwise({
            redirectTo: '/'
        })

}]);

