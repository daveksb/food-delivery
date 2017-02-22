cuisineApp.service('CartService', function($localStorage) {

    if (Array.isArray($localStorage.cartItems)) {
        //console.log("Service: localStorage.cartItems [have] value");
    } else {
        $localStorage.cartItems = [];
    }

    getItemIndex = function(item) {
        for (var i = 0; i < $localStorage.cartItems.length; i++) {
            if ($localStorage.cartItems[i].productid === item.productid && $localStorage.cartItems[i].extraname == item.extraname) {
                return i;
            }
        }
        return -1;
    };

    checkExistItem = function(product) {
        //console.log('**checkExistItem product=', product);
        for (var i = 0; i < $localStorage.cartItems.length; i++) {
            //if ($localStorage.cartItems[i].id === id) {
            if ($localStorage.cartItems[i].productid === product.id && $localStorage.cartItems[i].extraname == product.extraname) {
                return i; // // i is index of cartItems array
            }
        }
        return null;
    };

    return {

        calculateDiscount: function(payment, currentCartSum) {
            var discount = 0;
            if (payment == 1) { //cash
                discount = 0.15 * currentCartSum;
            } else { // card
                discount = 0.1 * currentCartSum;
            }
            //return discount.toFixed(2);
            return discount;
        },

        cartTotal: function(cartSum, discountAmount) {
            var cartTotal = cartSum - discountAmount;
            //return cartTotal.toFixed(2);
            return cartTotal;
        },

        cartSum: function() {
            var sum = 0;
            $localStorage.cartItems.forEach(function(item) {
                sum += item.qty * item.price;
            });
            //return sum.toFixed(2);
            return sum;
        },

        getItems: function() {
            return $localStorage.cartItems;
            //console.log("Service: localStorage.cartItems =", $localStorage.cartItems);
        },

        increase: function(item) {
            var index = getItemIndex(item);
            $localStorage.cartItems[index].qty += 1;
            var subtotal = $localStorage.cartItems[index].qty * $localStorage.cartItems[index].price;
            $localStorage.cartItems[index].subtotal = subtotal.toFixed(2);
            //console.log('$localStorage.cartItems=', $localStorage.cartItems)
        },

        decrease: function(item) {
            var index = getItemIndex(item);
            if (item.qty - 1 === 0) {
                $localStorage.cartItems.splice(index, 1);
            } else {
                $localStorage.cartItems[index].qty--;
                var subtotal = $localStorage.cartItems[index].qty * $localStorage.cartItems[index].price;
                $localStorage.cartItems[index].subtotal = subtotal.toFixed(2);
            }
            //console.log('$localStorage.cartItems=', $localStorage.cartItems)
        },

        clearCart: function() {
            $localStorage.cartItems = [];
            delete $localStorage.cartDiscount;
            delete $localStorage.cartSum;
            delete $localStorage.cartTotal;
            delete $localStorage.cartWithDelivery;
            delete $localStorage.itemSum;
            delete $localStorage.deliverySelected;
            delete $localStorage.paymentSelected;
            delete $localStorage.orderId;
        },

        itemSum: function() { //จำนวนสินค้าในตะกร้า
            var sum = 0;
            $localStorage.cartItems.forEach(function(item) {
                sum += item.qty;
            });
            $localStorage.itemSum = sum;
            return sum;
        },

        addItem: function(product) {
            //console.log('product=', product);
            if (!isNaN(product.extraprice)) { // extra was selected
                extraprice = product.extraprice
            } else(extraprice = 0);

            priceUpdate = product.price + extraprice;
            //var priceUpdate = 0;
            //var extraprice = 0;
            var item = {
                productid: product.id,
                name: product.name,
                extraid: product.extraid,
                extraname: product.extraname,
                qty: 1,
                price: priceUpdate,
                subtotal: product.price,
                image: product.image,
                comment: ''
            };

            var existItemIndex = checkExistItem(product);
            if (existItemIndex == null) {
                $localStorage.cartItems.push(item)
            } else {
                $localStorage.cartItems[existItemIndex].qty += 1;
                var subtotal = $localStorage.cartItems[existItemIndex].qty * product.price;
                $localStorage.cartItems[existItemIndex].subtotal = subtotal.toFixed(2);
            }
        },

    };
});
