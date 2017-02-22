var cuisineApp = angular.module('cuisineApp', ['stripe.checkout', 'angularPayments', 'mobile-angular-ui', 'lbServices', 'ngStorage', 'ui.router', 'auth0', 'angular-jwt', ]);

cuisineApp.config(function($stateProvider, $urlRouterProvider, authProvider, $httpProvider, jwtInterceptorProvider, jwtOptionsProvider) {

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: "main.html"
                //controller: 'mainCtrl'
        })
        .state('cart', {
            url: '/cart',
            templateUrl: "cart.html",
            controller: 'cartCtrl',
        })
        .state('checkout', {
            url: '/checkout',
            templateUrl: "checkout.html",
            controller: 'checkoutCtrl',
        })
        .state('cusorder', {
            url: '/cusorder',
            templateUrl: "cusorder.html",
            controller: 'cusorderCtrl',
            data: {
                requiresLogin: true
            }
        })
        .state('profile', {
            url: '/profile/:custid',
            templateUrl: "profile.html",
            controller: 'profileCtrl',
            data: {
                requiresLogin: true
            }
        })
        .state('finish', {
            url: '/finish/:orderid',
            templateUrl: "finish.html",
            controller: 'finishCtrl',
            data: {
                requiresLogin: true
            }
        });
    /*
        .state('finish', {
            url: '/finish/:orderid',
            templateUrl: "finish.html",
            controller: 'finishCtrl',
            resolve: {
                myOrder: function($stateParams, Orders, Orderdetail) {
                    return Orders.findById({
                        id: $stateParams.orderid,
                        filter: { include: 'details' }
                    });
                }
            }
        });
*/
    $urlRouterProvider.otherwise('/');

    authProvider.init({
        domain: 'akkradet.auth0.com',
        clientID: 'aGpN8Raz93muViVxXf45pnDaTdrBmyNk',
        loginUrl: '/returncustomer',
        loginState: 'home',
    });

    jwtInterceptorProvider.tokenGetter = function(auth) {
        return auth.idToken;
        //return $localStorage.token;
    }

    jwtOptionsProvider.config({
        tokenGetter: function() {
            return localStorage.getItem('id_token');
        },
        whiteListedDomains: ['localhost'],
        unauthenticatedRedirectPath: '/home'
    });

    $httpProvider.interceptors.push('jwtInterceptor');

});

cuisineApp.run(function(auth, $localStorage, jwtHelper, $rootScope) {

    auth.hookEvents();
    // This events gets triggered on refresh or URL change
    $rootScope.$on('$locationChangeStart', function() {
        var token = $localStorage.token;
        if (token) {
            if (!jwtHelper.isTokenExpired(token)) {
                if (!auth.isAuthenticated) {
                    auth.authenticate($localStorage.profile, token).then(function(profile) {
                        //console.log("Logged in via refresh token and got profile");
                        //console.log(profile);
                    }, function(err) {});;
                }
            } else {
                // Either show Login page or use the refresh token to get a new idToken
            }
        }
    });
});
