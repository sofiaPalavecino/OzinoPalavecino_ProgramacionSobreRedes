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
    password: "password",
    database: "Cine"
});
if (cluster.isWorker) {
    //atender a requests
    //reservar
    //
    process.on('reservar', function (id_usuario, butacas, id_funcion) {
        pool.getConnection(function (err, con) {
            if (err)
                throw err;
            con.beginTransaction(function (err) {
                if (err)
                    throw err;
                con.query("SELECT * FROM reservas WHERE ? = id_usuario AND ? = id_funcion;", [id_usuario, id_funcion], function (err, results, fields) {
                    if (err) {
                        return con.rollback(function () {
                            throw err;
                        });
                    }
                    else {
                        console.log("Esta función no está disponible");
                        process.send(results);
                        process.kill(process.pid);
                    }
                });
            });
        });
    });
    //cancelar reserva
    process.on('cancelar', function (id_funcion, id_usuario) {
        pool.getConnection(function (err, con) {
            con.beginTransaction(function (err) {
                if (err)
                    throw err;
                con.query("select * from reservas where " + id_funcion + " = funcion and " + id_usuario + " = usuario;", function (err, results, fields) {
                    if (err) {
                        return con.rollback(function () {
                            throw err;
                        });
                    }
                    if (results != "") {
                        con.query("delete from reservas where " + id_funcion + " = funcion and " + id_usuario + " = usuario;", function (err, results, fields) {
                            if (err) {
                                return con.rollback(function () {
                                    throw err;
                                });
                            }
                            else {
                                console.log("La reserva ha sido eliminada");
                                process.send(null);
                                process.kill(process.pid);
                            }
                        });
                    }
                    else {
                        con.release();
                        process.send("no existen reservas a nombre de este usuario");
                        process.kill(process.pid);
                    }
                });
            });
        });
    });
}
else {
    //crear el fork, el server y las requests
    var app = require('express')();
    var server = http.createServer(app);
    var port = 3000;
    console.log("Api de cine");
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({ extended: true }));
    //para ver todas las funciones
    app.get('/funciones', function (req, res) {
        pool.getConnection(function (err, con) {
            con.beginTransaction(function (err) {
                if (err)
                    throw err;
                con.query("SELECT * FROM funciones WHERE CURDATE() < fecha and butacas_disponibles not LIKE '[]';", function (err, results, fields) {
                    if (err)
                        throw err;
                    if (results == '') {
                        res.json("no hay funciones disponibles");
                    }
                    console.log("Funciones obtenidas");
                    res.json(results);
                });
            });
        });
        /*const worker = cluster.fork();
        
        worker.on('funciones', (result) =>{
            console.log("ii")
            res.status(200).send(result);
        });*/
    });
    //para reservar
    app.post('/reservar/:id_funcion', function (req, res) {
        console.log("ee");
        var id_funcion = req.params.id_funcion;
        var id_usuario = req.body.id_usuario;
        var butacas = req.body.butacas;
        console.log(butacas);
        var worker = cluster.fork();
        worker.send(id_usuario, butacas, id_funcion);
        worker.on('reservar', function (result) {
            res.status(200).send(result);
        });
    });
    //para cancelar la reserva
    app.post('/cancelar_reserva', function (req, res) {
        var worker = cluster.fork();
        var id_funcion = req.params.id_funcion;
        var id_usuario = req.body.cancelar;
        worker.send(id_funcion, id_usuario);
        worker.on('cancelar', function (result) {
            res.status(200).send(result);
        });
    });
    server.listen(port);
}
