var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var stripe = require('stripe')('sk_test_2YAHHASPPR6UbSocCzVGWY1X');
var app = express();
//app.use(bodyParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

// send charge to stripe api
app.post('/charge', function(req, res) {
    var stripeToken = req.body.stripeToken;

    stripe.charges.create({
            card: stripeToken,
            currency: 'aud',
            amount: req.body.totalAmount,
            metadata: {
                'order_id': req.body.orderId,
                'customer_name': req.body.cusName,
            }
        },
        function(err, charge) {
            if (err) {
                res.send(500, err);
            } else {
                res.send(204);
            }
        });
});

app.use(express.static(__dirname));
app.listen(process.env.PORT || 3099);
