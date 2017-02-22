cuisineApp.controller('checkoutCtrl', function($http, CartService, Orders, Customer, Orderdetail, $scope, $state, $localStorage) {

    $scope.init = function() {
        $scope.$storage.paymentSelected = false;
        $scope.$storage.payByCard = false;
        $scope.$storage.payByCash = false;
        $scope.$storage.cartDiscount = 0;
        $scope.cartTotal();
    }

    $scope.payByCard = function() {
        $scope.$storage.paymentSelected = true;
        $scope.$storage.payByCard = true;
        $scope.$storage.payByCash = false;
        $scope.$storage.paymentType = 0; //card
        $scope.$storage.discountRate = 10;
        $scope.calculateDiscount();
        $scope.cartTotal();
    }

    $scope.payByCash = function() {
        $scope.$storage.paymentSelected = true;
        $scope.$storage.payByCash = true;
        $scope.$storage.payByCard = false;
        $scope.$storage.paymentType = 1; //cash
        $scope.$storage.discountRate = 15;
        $scope.calculateDiscount();
        $scope.cartTotal();
    }

    $scope.calculateDiscount = function() {
        $scope.$storage.cartDiscount = CartService.calculateDiscount($scope.$storage.paymentType, $scope.$storage.cartSum);
    }

    $scope.cartTotal = function() {
        $scope.$storage.cartTotal = CartService.cartTotal($scope.$storage.cartWithDelivery, $scope.$storage.cartDiscount);
    }

    $scope.init();

});
