"use strict";
exports.__esModule = true;
var http = require("http");
var bodyparser = require("body-parser");
/*import { isBuffer } from 'node:util';
import { request } from 'node:http';*/
var cluster = require('cluster');
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "password",
    database: "Cine"
});
function obtenerButacas(butacas) {
    var arrayButacas = [];
    for (var i = 0; i <= butacas.length; i++) {
        if (butacas.charCodeAt(i) > 48 && butacas.charCodeAt(i) <= 57) {
            if (butacas.charCodeAt(i + 1) > 48 && butacas.charCodeAt(i + 1) <= 57) {
                arrayButacas.push(butacas[i - 1] + butacas[i] + butacas[i + 1]);
                i++;
            }
            else {
                arrayButacas.push(butacas[i - 1] + butacas[i]);
            }
        }
    }
    return arrayButacas;
}
if (cluster.isWorker) {
    //atender a requests
    //reservar
    //
    process.on('reservar', function (id_usuario, butacasA, id_funcion) {
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
                    if (results != "") {
                        con.query("select butacas_disponibles from funciones where id= ? and curdate()<fecha and butacas_disponibles not like '[]'", [id_funcion], function (err, results, fields) {
                            if (err)
                                return con.rollback(function () {
                                    throw err;
                                });
                            if (results != "[]") {
                                var contButaca = true; //verificacion que las butacas que seleccionó el usuario estén incluidas en las disponibles
                                for (var i = 0; i < butacasA.size() && contButaca == true; i++) {
                                    if (!results.includes(butacasA[i])) {
                                        contButaca = false;
                                    }
                                }
                                if (contButaca) {
                                    var updateButacas = "1";
                                    //actualizar el valor de las butacas
                                    con.query("update funciones set butacas_disponibles = " + updateButacas + " where id=?;", [id_funcion], function (err, results, fields) {
                                        if (err)
                                            return con.rollback(function () {
                                                throw err;
                                            });
                                    });
                                    con.query("insert into reservas (usuario,funcion,butacas) values (?,?,?)", [id_usuario, id_funcion, butacasA], function (err, results, fields) {
                                        if (err)
                                            return con.rollback(function () {
                                                throw err;
                                            });
                                        con.release();
                                        process.send("Reserva generada con éxito");
                                        process.kill(process.pid);
                                    });
                                }
                                else {
                                    con.release();
                                    process.send("las butacas elegidas no están disponibles");
                                    process.kill(process.pid);
                                }
                            }
                            else {
                                con.release();
                                process.send("no quedan butacas disponibles en esta función");
                                process.kill(process.pid);
                            }
                        });
                    }
                    else {
                        con.release();
                        process.send("El usuario ya ha hecho una reserva de esta función");
                        process.kill(process.pid);
                    }
                });
            });
        });
    });
    //cancelar reserva
    process.on('cancelar', function (butacasReservadas, funcion) {
        pool.getConnection(function (err, con) {
            con.beginTransaction(function (err) {
                if (err)
                    throw err;
                con.query("SELECT butacas_disponibles FROM funciones WHERE id=? ", [funcion], function (err, results, fields) {
                    if (err)
                        throw err;
                    var butacasDisponibles = obtenerButacas(results.butacas_disponibles);
                    for (var i = 0; i < butacasReservadas.size(); i++) {
                        butacasDisponibles.push(butacasReservadas[i]);
                    }
                    con.query("update funciones set butacas_disponibles=? where id=?", [JSON.stringify(butacasDisponibles), funcion], function (err, results, fields) {
                        if (err)
                            throw err;
                        con.release();
                        process.send("se liberaron las butacas");
                        process.kill(process.pid);
                    });
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
    });
    //para reservar
    app.post('/reservar/:id_funcion', function (req, res) {
        console.log("ee");
        var id_funcion = req.params.id_funcion;
        var id_usuario = req.body.id_usuario;
        var butacas = req.body.butacas;
        var cantButacas = 0;
        var butacasA = [];
        for (var i = 0; i <= butacas.length; i++) {
            if (butacas.charCodeAt(i) > 48 && butacas.charCodeAt(i) <= 57) {
                if (butacas.charCodeAt(i + 1) > 48 && butacas.charCodeAt(i + 1) <= 57) {
                    butacasA.push(butacas[i - 1] + butacas[i] + butacas[i + 1]);
                    i++;
                }
                else {
                    butacasA.push(butacas[i - 1] + butacas[i]);
                }
                cantButacas++;
            }
        }
        if (cantButacas > 6) {
            res.send("butacas de más");
        }
        else {
            var worker = cluster.fork();
            worker.send(id_usuario, butacasA, id_funcion);
            worker.on('reservar', function (result) {
                res.status(200).send(result);
            });
        }
    });
    //para cancelar la reserva
    app.post('/cancelar_reserva', function (req, res) {
        var worker = cluster.fork();
        var id_funcion = req.params.id_funcion;
        var id_usuario = req.body.id_usuario;
        var butacasReservadas = [];
        var funcion = 0;
        pool.getConnection(function (err, con) {
            con.beginTransaction(function (err) {
                if (err)
                    throw err;
                con.query("SELECT id,butacas_reservadas,funcion FROM reservas WHERE usuario = ? and funcion = ?", [id_funcion, id_usuario], function (err, results, fields) {
                    if (err)
                        throw err;
                    if (results == '') {
                        res.json("no hay reserva de este usuario para esta función");
                    }
                    else {
                        var id_reserva = results.id;
                        butacasReservadas = obtenerButacas(results.butacas_reservadas);
                        funcion = results.funcion;
                        con.query("delete from reservas where id=?", [id_reserva], function (err, results, fields) {
                            if (err)
                                throw err;
                            console.log("reserva eliminada");
                        });
                    }
                });
            });
        });
        worker.send(butacasReservadas, funcion);
        worker.on('cancelar', function (result) {
            res.status(200).send(result);
        });
    });
    server.listen(port);
    var CronJob = require('cron').CronJob;
    var job = new CronJob('* * * * * *', function () {
        console.log('You will see this message every second');
    }, null, true, 'America/Los_Angeles');
    job.start();
}
