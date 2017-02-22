cuisineApp.controller('mainCtrl', function (CartService, $scope, $timeout, Category, Customer, Product, Extra, $state, $localStorage, auth) {

    $scope.state = $state;
    $scope.userCat = { id: 6, name: 'Entree' }; //default category
    $scope.$storage = $localStorage;
    $scope.categories = Category.find();

    $scope.products = Product.find({
        filter: {
            //where: { category: $scope.userCat.id },
            //include: 'extras'
        }
    });

    $scope.catSelect = function (category) {
        $scope.userCat = category;
        $scope.products = Product.find({
            filter: {
                where: { category: category.id },
                include: 'extras'
            }
        });
        //console.log('$scope.products=', $scope.products);
    }

    $scope.cartSum = function () {
        $scope.$storage.cartSum = CartService.cartSum();
        return $scope.$storage.cartSum;
    }

    $scope.itemSum = function () {
        return CartService.itemSum();
    }

    $scope.addItem = function (product, arrayIndex) {
        CartService.addItem(product);
        $scope.products[arrayIndex].showAlert = true;
        $timeout(function () { $scope.products[arrayIndex].showAlert = false }, 3000);
    }

    $scope.updateMenu = function (pid, eid) {
        //console.log('products (pid)= ', $scope.products[pid])
        //console.log('pid = ', pid);
        //console.log('eid = ', eid);
        $scope.products[pid].extraid = $scope.products[pid].extras[eid].id;
        $scope.products[pid].extraname = $scope.products[pid].extras[eid].name;
        $scope.products[pid].extraprice = $scope.products[pid].extras[eid].pricediff;
        //console.log('$scope.products[pid].extraid=', $scope.products[pid].extraid);
    }


    $scope.logIn = function () {
        if ($scope.$storage.isAuthenticated) { // where to send logged in User to 
            console.log('HELLO1 $scope.$storage.dbCustId=', $scope.$storage.dbCustId);
            //$state.go('home');
            $state.go('profile', { custid: $scope.$storage.dbCustId }); //logged in user was redirect when he press next from cart
        } else {
            console.log('HELLO2');
            auth.signin({ // If not login yet , Just ask for password .
                authParams: { scope: 'openid name email' }
            }, function (profile, idToken, accessToken, state, refreshToken) {
                //console.log("profile = ", profile);
                //$scope.$storage.profile = profile;
                $scope.$storage.token = idToken;
                $scope.$storage.isAuthenticated = auth.isAuthenticated;
                // *******************************************************************************                      
                Customer.create({ id: '', auth0id: profile.identities[0].user_id }); // insert new row of customer
                // if there is current auth0id in database this command will be skip because duplicate id was not allowed

                $scope.$storage.auth0Customer = profile;
                //console.log("$scope.$storage.auth0Customer =", $scope.$storage.auth0Customer);
                // *******************************************************************************                       
                $scope.$storage.dbCustomer = Customer.findOne({
                    filter: { where: { auth0id: profile.identities[0].user_id } }
                }, function (data) {
                    //$state.go('checkout', { custid: data.id })
                    $scope.$storage.dbCustId = Number(data.id);
                    $state.go('profile', { custid: $scope.$storage.dbCustId });
                });
            },
                function (err) {
                    console.log("Error :(", err);
                });
        }
    }

    $scope.logOut = function () {
        auth.signout()
        $localStorage.isAuthenticated = false;
        $localStorage.$reset();
        $localStorage.cartItems = [];
        $state.go('home');
    }

});
