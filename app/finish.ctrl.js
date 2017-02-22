cuisineApp.controller('finishCtrl', function($scope, $timeout, $stateParams, CartService, $state, Orders, Orderdetail, Product, $localStorage) {

    $timeout(function() {}, 3500); // wait for order and details complete loaded

    CartService.clearCart();

    $scope.orderId = $stateParams.orderid;

    $scope.myOrder = Orders.findById({
        id: $scope.orderId,
        filter: { include: 'details' }
    }, function(orders) {
        angular.forEach(orders.details, function(value, key) {
            $scope.myOrder.details[key].product = Product.findById({
                id: value.productid
            })
        });

        CartService.clearCart();
    });

    //console.log('myOrder=', myOrder);
});
