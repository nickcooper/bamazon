# bamazon

## Overview
Bamazon is a Amazon-like storefront in the terminal utilizing Node and MySQL. There are three scripts that perform different things. 
* bamazonCustomer.js - is a customer view where you can view and order products.
* bamazonManager.js - is a manager view for viewing and adding inventory.
* bamazonSupervisor.js - is a supervisor view for viewing and adding departments.

## How to use
Customer View
```sh
$ node bamazonCustomer.js
```
![Customer](customer.gif)

Manager View
```sh
$ node bamazonManager.js
```
![Manager](manager.gif)

Supervisor View
```sh
$ node bamazonSupervisor.js
```
![Supervisor](supervisor.gif)

### Technologies Used
* npm node modules:
    * mysql
    * inquirer
    * console-table-printer