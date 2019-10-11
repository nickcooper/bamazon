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

function viewSales() {
    q(`SELECT departments.department_name, departments.over_head_costs, SUM(products.product_sales) as product_sales, SUM(products.product_sales) - departments.over_head_costs as total_profit FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_name, departments.over_head_costs;`, function (data) {
        printTable(data);
        connection.end();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            name: "department_name",
            message: "Department Name?"
        },
        {
            name: "over_head_costs",
            message: "Over Head Costs?"
        }
    ]).then(function (res) {

        q(`INSERT INTO departments (department_name, over_head_costs) VALUES ('${res.department_name}', '${res.over_head_costs}');`, function (data) {
            console.log("Department added.");
            connection.end();
        });
    });
}

inquirer.prompt([
    {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department"]
    }
]).then(function (res) {
    connection.connect(function (err) {
        if (err) throw err;
        //console.log("connected as id " + connection.threadId + "\n");
    });
    switch (res.action) {
        case "View Product Sales by Department":
            viewSales();
            break;
        case "Create New Department":
            addDepartment();
            break;
        default:
            console.log("Unknown action.");
    };
});