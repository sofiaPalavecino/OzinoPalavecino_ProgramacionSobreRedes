const express = require("express");
const mysql = require("mysql");
const app=express();

var connection= mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"password",
    database:"ecommerce",
    port:"3306"
})
connection.connect((err)=>{
    if(err){
        throw err;
    }
    else{
        console.log("conectó");
    }
})

connection.query('CREATE TABLE compras(id INT(14) NOT NULL AUTO_INCREMENT, id_usuario int(11) NOT NULL,id_producto int(11) NOT NULL,cantidad int(11) NOT NULL, fecha datetime NOT NULL,comprador_calificado tinyint(4) NOT NULL, vendedor_calificado tinyint(4) NOT NULL, PRIMARY KEY (`id`))', (err,rows)=>{
    if(err){
        throw err;
    }
    else{
        console.log(rows);
    }
})