  cuisineApp.controller('cartCtrl', function(CartService, $scope, $state, $localStorage, auth) {

      $scope.init = function() {
          $scope.checkEmptyCart();
          $scope.orderDetails = [];
          $scope.temp = [];
          $scope.cartSum();
          //$scope.cartWithDelivery($scope.$storage.delivered);
          $scope.$storage.deliverySelected = false;
          $scope.$storage.isDeliver = false;
          $scope.$storage.isPickup = false;
          //console.log('cartWithDelivery1 = ', $scope.$storage.cartWithDelivery);
      }

      $scope.checkEmptyCart = function() {
          if ($scope.$storage.itemSum == 0) { $state.go('home') }
      };

      $scope.isDeliverChecked = function() {
          $scope.$storage.delivered = true;
          $scope.$storage.isDeliver = true;
          $scope.$storage.isPickup = false;
          $scope.$storage.deliverySelected = true;
          $scope.cartWithDelivery($scope.$storage.delivered);
      }

      $scope.isPickupChecked = function() {
          $scope.$storage.delivered = false;
          $scope.$storage.isPickup = true;
          $scope.$storage.isDeliver = false;
          $scope.$storage.deliverySelected = true;
          $scope.cartWithDelivery($scope.$storage.delivered)
      }

      $scope.cartWithDelivery = function(deliveryType) {
          if (deliveryType == 1) {
              //$scope.$storage.cartWithDelivery = (Number($scope.$storage.cartSum) + 5).toFixed(2);
              $scope.$storage.cartWithDelivery = (Number($scope.$storage.cartSum) + 5);
          } else {
              $scope.$storage.cartWithDelivery = $scope.$storage.cartSum;
          }
      }

      $scope.toggleSpecialOrder = function(cartItemIndex, orderDetails) {
          //console.log('orderDetails=', orderDetails);
          if (typeof $scope.temp[cartItemIndex] == 'undefined') { $scope.temp[cartItemIndex] = false }
          $scope.temp[cartItemIndex] = !$scope.temp[cartItemIndex];
      }

      $scope.addSpecialOrder = function(cartItemIndex, orderDetails) {
          //console.log('orderDetails=', orderDetails);
          if (typeof $scope.temp[cartItemIndex] == 'undefined') { $scope.temp[cartItemIndex] = false }
          $scope.temp[cartItemIndex] = !$scope.temp[cartItemIndex];
          $scope.$storage.cartItems[cartItemIndex].comment = orderDetails;
      }

      $scope.clearCart = function() {
          CartService.clearCart();
      }

      $scope.increase = function(item) {
          CartService.increase(item);
          $scope.cartSum();
          $scope.cartWithDelivery($scope.$storage.delivered);
      }

      $scope.decrease = function(item) {
          CartService.decrease(item);
          $scope.cartSum();
          $scope.cartWithDelivery($scope.$storage.delivered);
      }

      $scope.init();
  });
