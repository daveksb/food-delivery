//cuisineApp.controller('profileCtrl', function($scope, $state, Customer, $localStorage, $timeout) {

cuisineApp.controller('profileCtrl', function ($http, CartService, Orders, Customer, Orderdetail, $scope, $state, $stateParams, $localStorage, $timeout) {

    //$scope.$storage.dbCustId = $stateParams.custid;

    if ($stateParams.custid) {
        $scope.$storage.dbCustId = $stateParams.custid;
        console.log('get dbCustId from stateParam =', $scope.$storage.dbCustId);
    } else {
        console.log('have dbCustId =', $scope.$storage.dbCustId);
    }

    $scope.cartTotalInCent = $scope.$storage.cartTotal * 100;

    $scope.$storage.dbCustomer =
        Customer.findOne({
            filter: { where: { auth0id: $scope.$storage.auth0Customer.identities[0].user_id } }
        });

    $scope.editProfile = function () {
        $scope.$storage.dbCustomer.$save();
        $scope.profileSubmit = true;
        $timeout(function () { $scope.profileSubmit = false }, 2000);
        //console.log("EditProfil: scope.$storage.dbCustomer = ", $scope.$storage.dbCustomer);
    }

    $scope.setPrepareOrder = function () {
        $scope.prepareOrder = {
            id: '',
            custid: $scope.$storage.dbCustId,
            //custid: $scope.$storage.dbCustomer.id,
            orderdate: new Date(),
            status: 1,
            subtotal: $scope.$storage.cartSum,
            discount: $scope.$storage.cartDiscount,
            total: $scope.$storage.cartTotal,
            paymethod: $scope.$storage.paymentType,
            delivered: $scope.$storage.delivered,
            ispaid: 0,
        };
        console.log('prepareOrder = ', $scope.prepareOrder);
    }

    $scope.postOrder = function () {
        //first check the cart is empty ?
        Orders.create($scope.prepareOrder, function (result) { // first create Order
            $scope.$storage.orderId = result.id;
            // then create order details
            for (var i = 0, len = $scope.$storage.cartItems.length; i < len; i++) {
                //console.log('$scope.$storage.cartItems[i].subtotal =', $scope.$storage.cartItems[i].subtotal);
                var objDetail = {
                    id: '',
                    orderid: result.id,
                    productid: $scope.$storage.cartItems[i].productid,
                    extraid: $scope.$storage.cartItems[i].extraid,
                    qty: $scope.$storage.cartItems[i].qty,
                    price: $scope.$storage.cartItems[i].price,
                    subtotal: $scope.$storage.cartItems[i].subtotal,
                    comment: $scope.$storage.cartItems[i].comment,
                };
                Orderdetail.create(objDetail);
                //console.log('cartItems = ', $scope.$storage.cartItems[i]);
            }

            if ($scope.$storage.paymentType == 1) { // cash
                console.log("ddd ccc");
                $state.go('finish', { orderid: $scope.$storage.orderId });
            }

        });
    }

    $scope.doCheckout = function (token) {
        //alert("Got Stripe token: " + token.id);
        console.log("Stripe token = ", token);
        $http({
            url: 'http://yoururl.com:3099/charge',
            method: "POST",
            data: {
                stripeToken: token.id  ,
                totalAmount: $scope.cartTotalInCent,
                orderId: $scope.$storage.orderId,
                cusName: $scope.$storage.dbCustomer.name,
            },
        }).success(function (data, status, headers, config) {
            //console.log("Charge Token was Send");
            console.log("Check out Success");
            $state.go('finish', { orderid: $scope.$storage.orderId })
        }).error(function (data, status, headers, config) {
            console.log("Get Error", status);
            $scope.checkoutStatus = 'Error';
        });
    }

    $scope.setPrepareOrder();

});
