cuisineApp.controller('cusorderCtrl', function($scope, $state, Orders, Orderstatus, Product, Orderdetail, $localStorage) {

    $scope.orders = Orders.find({
        filter: {
            where: { custid: $scope.$storage.dbCustomer.id },
            order: 'id DESC'
        } ,


    }, function(foundOrders) {
        //console.log('foundOrders=', foundOrders)
        angular.forEach(foundOrders, function(value, key) {
            $scope.orders[key].statusdetails = Orderstatus.findById({
                id: value.status
            })
        })
    });

    $scope.showDetails = function(orderId) {
        $scope.selectedOrder = orderId;
        //console.log('orderId =', orderId);
        $scope.myOrder = Orders.findById({
            id: orderId,
            filter: { include: 'details' }
        }, function(orders) {
            angular.forEach(orders.details, function(value, key) {

                $scope.myOrder.details[key].product = Product.findById({
                    id: value.productid
                })

            });
        });
        //console.log('orders =', $scope.orders)
    }

});
