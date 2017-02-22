var myApp = angular.module('myApp', ['ng-admin']);

myApp.config(['NgAdminConfigurationProvider', function (NgAdminConfigurationProvider) {

    var nga = NgAdminConfigurationProvider;

    var admin = nga.application('Siam Thai Cuisine Control Panel').baseApiUrl('http://localhost:3000/api/');

    admin.menu(nga.menu()
        .addChild(nga.menu(nga.entity('Orders')).icon('<span class="glyphicon glyphicon-bell"></span>'))
        .addChild(nga.menu(nga.entity('Products'))
            .title('Product')
            .icon('<span class="glyphicon glyphicon-shopping-cart"></span>'))
        .addChild(nga.menu(nga.entity('Customers')).icon('<span class="glyphicon glyphicon-user"></span>'))
        .addChild(nga.menu(nga.entity('Categories')).icon('<span class="glyphicon glyphicon-folder-open"></span>'))
        .addChild(nga.menu(nga.entity('Extras')).icon('<span class="glyphicon glyphicon-folder-open"></span>'))
    );

    var category = nga.entity('Categories');
    category.listView().fields([
        nga.field('id'),
        nga.field('name').isDetailLink(true),
        nga.field('description'),
    ]);
    category.creationView().fields([
        nga.field('name'),
        nga.field('description'),
    ]);
    category.editionView().fields(category.creationView().fields());
    admin.addEntity(category);


    var product = nga.entity('Products').identifier(nga.field('id'));
    product.listView().perPage(10).sortDir('asc')
        .fields([
            nga.field('id').isDetailLink(true),
            nga.field('image').template(entry => `<img src="${entry.values.image}" width="80" height="60" style="margin-top:-5px" />`),
            nga.field('name').isDetailLink(true),
            nga.field('category', 'reference')
                .targetEntity(nga.entity('Categories'))
                .targetField(nga.field('name')),
            nga.field('price'),
            /*        nga.field('promotion', 'choice')
                    .choices([
                        { value: '1', label: 'Enabled' },
                        { value: '0', label: 'Disabled' },
                    ])
                    .cssClasses(function(entry) { // add custom CSS classes to inputs and columns
                        if (!entry) return;
                        if (entry.values.promotion == '0') {
                            return 'text-center bg-danger';
                        }
                        if (entry.values.promotion == '1') {
                            return 'text-center bg-success';
                        }
                    }),
            */
            nga.field('enabled', 'choice')
                .choices([
                    { value: '1', label: 'Enabled' },
                    { value: '0', label: 'Disabled' },
                ])
                .cssClasses(function (entry) { // add custom CSS classes to inputs and columns
                    if (!entry) return;
                    if (entry.values.enabled == '0') {
                        return 'text-center bg-danger';
                    }
                    if (entry.values.enabled == '1') {
                        return 'text-center bg-success';
                    }
                }),
        ]);
    product.creationView().fields([
        nga.field('category', 'reference')
            .targetEntity(nga.entity('Categories'))
            .targetField(nga.field('name')),
        nga.field('name'),
        nga.field('price').cssClasses('col-sm-2'),
        nga.field('made_with', 'referenced_list')
            .targetEntity(nga.entity('Extras'))
            .targetReferenceField('productid') // column in table extra that map to table product
            .targetFields([
                nga.field('id', 'reference')
                    .targetEntity(nga.entity('Extras'))
                    .targetField(nga.field('name')),
                nga.field('pricediff')
            ]),
        nga.field('image').cssClasses('col-sm-7'),
        nga.field('description'),
        nga.field('enabled', 'boolean').validation({ required: true }),
        nga.field('', 'template').label('')
            .template('<img src="{{ entry.values.image }}" height="480" width="640" />'),
    ]);
    product.editionView().fields(product.creationView().fields());
    admin.addEntity(product);


    var extra = nga.entity('Extras');
    extra.listView().fields([
        nga.field('id').isDetailLink(true),
        nga.field('productid', 'reference')
            .targetEntity(nga.entity('Products'))
            .targetField(nga.field('name'))
            .isDetailLink(false),
        nga.field('name').isDetailLink(true),
        nga.field('pricediff')
    ]);
    extra.creationView().fields([
        /*    nga.field('productid', 'reference')
            .targetEntity(nga.entity('Products'))
            .targetField(nga.field('name')),*/
        nga.field('productid').cssClasses('col-sm-2'),
        nga.field('name').cssClasses('col-sm-2'),
        nga.field('pricediff').cssClasses('col-sm-2'),
    ]);
    extra.editionView().fields(extra.creationView().fields());
    admin.addEntity(extra);


    var customer = nga.entity('Customers');
    customer.listView().fields([
        nga.field('name').isDetailLink(true),
        nga.field('phone'),
        nga.field('address')
    ]);
    customer.creationView().fields([
        nga.field('name').cssClasses('col-sm-3'),
        nga.field('phone').cssClasses('col-sm-2'),
        nga.field('address').cssClasses('col-sm-3'),
        nga.field('city').cssClasses('col-sm-3'),
        nga.field('postalcode').cssClasses('col-sm-2'),
    ]);
    customer.editionView().fields(customer.creationView().fields());
    admin.addEntity(customer);


    var orderdetail = nga.entity('Orderdetails');
    orderdetail.listView().fields([
        nga.field('id').isDetailLink(true),
        nga.field('orderid'),
        nga.field('productid')
    ]);
    orderdetail.creationView().fields([
        nga.field('id'),
        nga.field('orderid'),
        nga.field('productid'),
    ]);
    orderdetail.editionView().fields(orderdetail.creationView().fields());
    admin.addEntity(orderdetail);


    var order = nga.entity('Orders')
    order.listView().perPage(10)
    order.listView().fields([
        nga.field('id'),
        nga.field('orderdate', 'datetime').isDetailLink(true),
        nga.field('custid', 'reference')
            .targetEntity(nga.entity('Customers'))
            .targetField(nga.field('name'))
            .label('Customer').isDetailLink(false),
        nga.field('subtotal', 'number').format('$0,0.00'),
        nga.field('discount', 'number').format('$0,0.00'),
        nga.field('total', 'number').format('$0,0.00'),
        nga.field('paymethod', 'choice')
            .choices([
                { value: '1', label: 'Cash' },
                { value: '0', label: 'Credit Card' },
            ]),
        nga.field('delivered', 'choice')
            .choices([
                { value: '1', label: 'Delivery' },
                { value: '0', label: 'Pick Up' },
            ]),
        nga.field('status', 'choice')
            .choices([
                { value: '1', label: 'pending' },
                { value: '2', label: 'confirmed' },
                { value: '3', label: 'delivered' },
                { value: '4', label: 'canceled' },
            ])
            .cssClasses(function (entry) { // add custom CSS classes to inputs and columns
                if (!entry) return;
                if (entry.values.status == '1') {
                    return 'text-center bg-warning';
                }
                if (entry.values.status == '2') {
                    return 'text-center bg-info';
                }
                if (entry.values.status == '3') {
                    return 'text-center bg-success';
                }
                return 'text-center bg-danger';
            }),
    ])
        .listActions(['<ma-edit-button entry="::entry" entity="::entity" size="xs" label="Details"></ma-edit-button>']);


    order.creationView().fields([
        nga.field('orderdate', 'datetime')
            .editable(false),
        nga.field('custid', 'reference')
            .targetEntity(nga.entity('Customers'))
            .targetField(nga.field('name'))
            .label('Customer')
            .editable(false),
        nga.field('status', 'reference')
            .targetEntity(nga.entity('Orderstatuses'))
            .targetField(nga.field('statusname'))
            .cssClasses('col-sm-2'),
        nga.field('items', 'referenced_list')
            .targetEntity(nga.entity('Orderdetails'))
            .targetReferenceField('orderid') // column in table orderdetail that map to table orders
            .targetFields([
                nga.field('productid', 'reference')
                    .targetEntity(nga.entity('Products'))
                    .targetField(nga.field('name')),
                nga.field('extraid', 'reference')
                    .targetEntity(nga.entity('Extras'))
                    .targetField(nga.field('name')),
                nga.field('qty'),
                nga.field('price'),
                nga.field('subtotal'),
                nga.field('comment'),
            ]),
        nga.field('subtotal', 'number').format('$0,0.00').editable(false),
        nga.field('discount', 'number').format('$0,0.00').editable(false),
        nga.field('total', 'number').format('$0,0.00').editable(false),
        nga.field('paymethod', 'choice')
            .choices([
                { label: 'Credit Card', value: '0' },
                { label: 'Cash', value: '1' }
            ]).editable(false),
        nga.field('delivered', 'boolean').editable(false).validation({ required: true }),
    ]);
    order.editionView().fields(order.creationView().fields());
    admin.addEntity(order);


    var orderStatus = nga.entity('Orderstatuses');
    orderStatus.listView().fields([
        nga.field('statusname').isDetailLink(true),
    ]);
    orderStatus.creationView().fields([
        nga.field('statusname'),
    ]);
    orderStatus.editionView().fields(orderStatus.creationView().fields());
    admin.addEntity(orderStatus);

    nga.configure(admin);

}]);

/*
myApp.config(['RestangularProvider', function(RestangularProvider) {
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
        if (operation == 'getList') {
            delete params._page;
            delete params._perPage;

            if (params._filters) {
                for (var filter in params._filters) {
                    //params[filter] = params._filters[filter];
                    params.filter = '{"where":{"orderid":"' + params._filters[filter] + '"}}';
                }
                delete params._filters;
            }
        }
        return { params: params };
    });
}]);
*/

myApp.config(['RestangularProvider', function (RestangularProvider) {
    RestangularProvider.addFullRequestInterceptor(function (element, operation, what, url, headers, params, httpConfig) {
        if (operation == 'getList') {
            if (params._filters) {
                for (var entry in params._filters) {
                    if (params._filters[entry] !== undefined) {
                        if (params._filters[entry].constructor === Array && params._filters[entry].length > 1) { // where value in array of values
                            params['filter[where][' + entry + '][inq]'] = params._filters[entry];
                        } else { // where entry = value
                            params['filter[where][' + entry + ']'] = params._filters[entry];
                        }
                    }
                }
                delete params._filters;
            }
        }
        return { params: params };
    });
}]);


// Pagination and Filter Configuration Extra for ng-admin+loopback API server
// Loopback.io API Mapping
myApp.config(['RestangularProvider', function (RestangularProvider) {

    function Get(yourUrl) {
        var Httpreq = new XMLHttpRequest();
        Httpreq.open("GET", yourUrl, false);
        Httpreq.send(null);
        return Httpreq.responseText;
    };
    RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
        if (operation === 'getList') {
            var Result = JSON.parse(Get(url + '/count'));
            response.totalCount = Result.count;
        }
        return data;
    });

    // use the custom query parameters function to format the API request correctly
    RestangularProvider.addFullRequestInterceptor(function (element, operation, what, url, headers, params) {
        if (operation === "getList") {
            // custom pagination params
            if (params._page) {
                params['filter[limit]'] = params._perPage;
                params['filter[skip]'] = (params._page - 1) * params._perPage; //skip is the same os offset
                delete params._page;
                delete params._perPage;
            }
            // custom sort params
            if (params._sortField) {
                params['filter[order]'] = params._sortField + ' ' + params._sortDir;
                delete params._sortDir;
                delete params._sortField;
            }
            return { params: params };
        }
    });
}]);
