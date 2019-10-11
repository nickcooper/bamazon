var mysql = require("mysql");
var inquirer = require("inquirer");
var {printTable} = require("console-table-printer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "nc246Qer!",
    database: "bamazon"
});

function q(sql, callback) {
    connection.query(sql, function (err, data) {
        if (err) throw err;
        callback(data);
    });
}

function viewProducts() {
    q(`SELECT * FROM products;`, function (data) {
        printTable(data);
        connection.end();
    });
}

function viewLowInventory() {
    q(`SELECT * FROM products WHERE stock_quantity < 5;`, function (data) {
        printTable(data);
        connection.end();
    });
}

function addInventory() {
    q(`SELECT product_name, stock_quantity FROM products;`, function (data) {
        inquirer.prompt([
            {
                type: "list",
                name: "item",
                message: "Which item to add inventory?",
                choices: data.map(x => x.product_name)
            },
            {
                type: "number",
                name: "amount",
                message: "How many to add?"
            }
        ]).then(function (res) {
            for (var i = 0; i < data.length; i++) {
                if (res.item === data[i].product_name) {
                    q(`UPDATE products SET stock_quantity = ${connection.escape(data[i].stock_quantity + res.amount)} WHERE product_name = ${connection.escape(data[i].product_name)};`, function (data) {
                        console.log("Product inventory count updated.");
                        connection.end();
                    });
                }
            }
        });
    });
}

function addProduct() {
    inquirer.prompt([
        {
            name: "product_name",
            message: "Product Name?"
        },
        {
            name: "department_name",
            message: "Department Name?"
        },
        {
            name: "price",
            message: "Price?"
        },
        {
            name: "stock_quantity",
            message: "Stock Quantity?"
        }
    ]).then(function (res) {
        console.log(res);

        q(`INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('${res.product_name}', '${res.department_name}', '${res.price}', '${res.stock_quantity}');`, function (data) {
            console.log("Product added.");
            connection.end();
        });
    });
}

inquirer.prompt([
    {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }
]).then(function (res) {
    connection.connect(function (err) {
        if (err) throw err;
        //console.log("connected as id " + connection.threadId + "\n");
    });
    switch (res.action) {
        case "View Products for Sale":
            viewProducts();
            break;
        case "View Low Inventory":
            viewLowInventory();
            break;
        case "Add to Inventory":
            addInventory();
            break;
        case "Add New Product":
            addProduct();
            break;
        default:
            console.log("Unknown action.");
    };
});