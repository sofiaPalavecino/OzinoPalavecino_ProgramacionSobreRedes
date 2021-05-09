"use strict";
exports.__esModule = true;
var http = require("http");
var bodyparser = require("body-parser");
var cluster = require('cluster');
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "root",
    database: "Cine"
});
if (cluster.isWorker) {
    //atender a requests
    //funciones
    process.on('funciones', function (message) {
        console.log("uu");
        pool.getConnection(function (err, con) {
            con.beginTransaction(function (err) {
                if (err)
                    throw err;
                con.query("SELECT * FROM funciones WHERE CURDATE() > fecha and butacas_disponibles not LIKE '[]';", function (err, results, fields) {
                    if (err) {
                        return con.rollback(function () {
                            throw err;
                        });
                    }
                    con.commit(function (err) {
                        if (err) {
                            return con.rollback(function () {
                                throw err;
                            });
                        }
                        if (results = '') {
                            return con.rollback(function () {
                                console.log("no hay funciones disponibles");
                            });
                        }
                        con.release();
                        console.log("Funciones obtenidas");
                        process.send(results);
                        process.kill(process.pid);
                    });
                });
            });
        });
    });
    //reservar
    /* process.on('reserva',(id_usuario, butacas, id_funcion)=>{
         if(){
             pool.getConnection(function(err, con){
                 con.beginTransaction(function(err){
                     if(err) throw err;
                     con.query("SELECT * FROM reservas WHERE "+id_usuario+" = id_usuario AND "+id_funcion+" = id_funcion", function(err,results,fields){
                         if (err) {
                             return con.rollback(function() {
                                 throw err;
                             });
                         }
                     });
                 });
             });
         }
         else{
             console.log(`No puede reservar mas de 6 butacas`);
             process.send(null);
             process.kill(process.pid);
         }
     });*/
    //cancelar reserva
    process.on('cancelar', function (cancelar) {
    });
}
else {
    //crear el fork, el server y las requests
    var app = require('express')();
    var server = http.createServer(app);
    var port = 3000;
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({ extended: true }));
    console.log("aaa");
    //para ver todas las funciones
    app.get('/funciones', function (req, res) {
        console.log("ee");
        var worker = cluster.fork();
        worker.send("funciones");
        worker.on('funciones', function (result) {
            console.log("ii");
            res.status(200).send(result);
        });
    });
    //para reservar
    app.post('/reservar/:id_funcion', function (req, res) {
        var id_usuario = req.body.id_usuario;
        var butacas = req.body.butacas;
        var id_funcion = req.params.id_funcion;
        var worker = cluster.fork();
        worker.send(id_usuario, butacas, id_funcion);
        worker.on('reserva', function (result) {
            res.status(200).send(result);
        });
    });
    //para cancelar la reserva
    app.post('/cancelar_reserva', function (req, res) {
        var worker = cluster.fork();
        worker.send(req.body.cancelar);
        worker.on('cancelar', function (result) {
            res.status(200).send(result);
        });
    });
    server.listen(port);
}
