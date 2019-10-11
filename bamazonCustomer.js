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
    connection.query(sql, function(err, data) {
        if (err) throw err;
        callback(data);
    });
}

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    q(`SELECT * FROM products;`, function(data) {
        printTable(data);
    
        inquirer.prompt([
            {
                type: "number",
                name: "item_id",
                message: "What Product ID do you want to buy?"
            },
            {
                type: "number",
                name: "item_count",
                message: "How many do you want to buy?"
            }
        ]).then(function (res) {
    
            q(`SELECT * FROM products WHERE item_id = ${connection.escape(res.item_id)};`, function(data){
                var data = data[0];
                if (data.stock_quantity >= res.item_count) {
        
                    var total = parseFloat(data.price) * parseFloat(res.item_count);
                    var sales = parseFloat(data.product_sales) + total;
                    console.log(`You purchased ${res.item_count} ${data.product_name} @ $${data.price}. Total: $${total}`);
        
                    q(`UPDATE products SET stock_quantity = ${data.stock_quantity - res.item_count}, product_sales = ${sales} WHERE item_id = ${data.item_id};`, function(data){
                        connection.end();
                    })
                } else {
                    console.log("Insufficient quantity!");
                    connection.end();
                }
            }); 
        });
    });
});