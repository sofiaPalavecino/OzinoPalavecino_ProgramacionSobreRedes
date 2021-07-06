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
    process.on('reservar', function (id_usuario, butacasA, id_funcion) {
        pool.getConnection(function (err, con) {
            if (err)
                throw err;
            con.beginTransaction(function (err) {
                if (err)
                    throw err;
                //revisar si el usuario ya hizo una reserva de esa función 
                con.query("SELECT * FROM reservas WHERE ? = id_usuario AND ? = id_funcion;", [id_usuario, id_funcion], function (err, results, fields) {
                    if (err) {
                        return con.rollback(function () {
                            throw err;
                        });
                    }
                    /*si no hay ninguna reserva realizada por ese usuario, se revisa si hay
                    butacas disponibles de la función seleccionada*/
                    if (results != "") {
                        con.query("select butacas_disponibles from funciones where id= ? and curdate()<fecha and butacas_disponibles not like '[]' and vigente=1;", [id_funcion], function (err, results, fields) {
                            if (err)
                                return con.rollback(function () {
                                    throw err;
                                });
                            if (results != "") {
                                var contButaca = true; //verificacion que las butacas que seleccionó el usuario estén incluidas en las disponibles
                                //verificar si las butacas están disponibles
                                var resButacas = obtenerButacas(results);
                                for (var i = 0; i < butacasA.size() && contButaca == true; i++) {
                                    if (!resButacas.includes(butacasA[i])) {
                                        contButaca = false;
                                    }
                                    else {
                                        //actualizar el valor de las butacas
                                        resButacas.slice(resButacas.indexOf(butacasA[i]), 1);
                                    }
                                }
                                if (contButaca) {
                                    if (resButacas.length == 0) {
                                        con.query("update funciones set butacas_disponibles = " + resButacas + " and vigente=0 where id=?;", [id_funcion], function (err, results, fields) {
                                            if (err)
                                                return con.rollback(function () {
                                                    throw err;
                                                });
                                        });
                                    }
                                    else {
                                        con.query("update funciones set butacas_disponibles = " + resButacas + " where id=?;", [id_funcion], function (err, results, fields) {
                                            if (err)
                                                return con.rollback(function () {
                                                    throw err;
                                                });
                                        });
                                    }
                                    con.query("insert into reservas (usuario,funcion,butacas) values (?,?,?);", [id_usuario, id_funcion, butacasA], function (err, results, fields) {
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
    process.on('cancelar', function (butacasReservadas, funcion, id_reserva) {
        pool.getConnection(function (err, con) {
            con.beginTransaction(function (err) {
                if (err)
                    throw err;
                con.query("delete from reservas where id=?;", [id_reserva], function (err, results, fields) {
                    if (err)
                        throw err;
                    console.log("reserva eliminada");
                });
                con.query("SELECT butacas_disponibles FROM funciones WHERE id=?;", [funcion], function (err, results, fields) {
                    if (err)
                        throw err;
                    var butacasDisponibles = obtenerButacas(results[0].butacas_disponibles);
                    //si ya no quedaban butacas disponibles
                    if (butacasDisponibles.length == 0) {
                        con.query("update funciones set butacas_disponibles=? and vigente=1 where id=?;", [butacasReservadas, funcion], function (err, results, fields) {
                            if (err)
                                throw err;
                        });
                    }
                    else {
                        for (var i = 0; i < butacasReservadas.length; i++) {
                            butacasDisponibles.push(butacasReservadas[i]);
                        }
                        con.query("update funciones set butacas_disponibles=? where id=?;", [butacasDisponibles, funcion], function (err, results, fields) {
                            if (err)
                                throw err;
                        });
                    }
                });
                con.release();
                process.send("se liberaron las butacas");
                process.kill(process.pid);
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
                con.query("SELECT * FROM funciones WHERE CURDATE() < fecha and butacas_disponibles not LIKE '[]' and fecha > NOW();", function (err, results, fields) {
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
        var id_reserva = 0;
        pool.getConnection(function (err, con) {
            con.beginTransaction(function (err) {
                if (err)
                    throw err;
                con.query("SELECT reservas.id,butacas_reservadas,funciones.fecha FROM reservas join funciones on funcion=funciones.id WHERE usuario = ? and funcion = ? and funciones.fecha >= DATE_ADD(NOW(), INTERVAL 1 HOUR);", [id_usuario, id_funcion], function (err, results, fields) {
                    if (err)
                        throw err;
                    if (results == '') {
                        res.json("no existe reserva o falta menos de una hora para la proyección de la función");
                    }
                    else {
                        id_reserva = results[0].id;
                        butacasReservadas = obtenerButacas(results[1].butacas_reservadas);
                    }
                });
            });
        });
        worker.send(butacasReservadas, id_funcion, id_reserva);
        worker.on('cancelar', function (result) {
            res.status(200).send(result);
        });
    });
    var CronJob = require('cron').CronJob;
    //cuando la película está a cinco minutos de iniciar se pasa su estado a no vigente
    var job = new CronJob('*/5 * * * *', function () {
        pool.getConnection(function (err, con) {
            con.beginTransaction(function (err) {
                if (err)
                    throw err;
                con.query("update funciones set vigente=0 where vigente = 1 and fecha between NOW() and DATE_ADD(NOW(), INTERVAL 5 MINUTE);", function (err, results, fields) {
                    if (err)
                        throw err;
                });
            });
        });
    }, null, true, 'America/Los_Angeles');
    job.start();
    server.listen(port);
}
