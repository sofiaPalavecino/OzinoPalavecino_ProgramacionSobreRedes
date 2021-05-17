import express, { json } from 'express';
import * as http from 'http';
import * as bodyparser from 'body-parser';    
import { isBuffer } from 'node:util';
import { request } from 'node:http';

const cluster = require('cluster');

const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "root",
    database: "Cine"
});

if(cluster.isWorker){
    //atender a requests
    //funciones
    process.on('funciones', message =>{
        console.log("uu")
        pool.getConnection(function(err, con){
            con.beginTransaction(function(err){
                if(err) throw err;
                con.query("SELECT * FROM funciones WHERE CURDATE() > fecha and butacas_disponibles not LIKE '[]';",function(err,results,fields){
                    
                    if (err) {
                        return con.rollback(function() {
                            throw err;
                        });
                    }
                    con.commit(function(err){
                        if (err) {
                            return con.rollback(function() {
                                throw err;
                            });
                        }
                        if(results=''){
                            return con.rollback(function() {
                                console.log("no hay funciones disponibles");
                            });
                        }
                        con.release();
                        console.log(`Funciones obtenidas`);
                        process.send(results);
                        process.kill(process.pid);
                    });
                });
            });
        });
    });
    //reservar
    //
    process.on('reserva',(id_usuario, butacas, id_funcion)=>{
        if(butacas){
            pool.getConnection(function(err, con){
                con.beginTransaction(function(err){
                    if(err) throw err;
                    
                    con.query("SELECT * FROM funciones WHERE "+id_funcion+"=id and CURDATE() < fecha and butacas_disponibles LIKE '[]';", function(err,results,fields){
                        if (err) {
                            return con.rollback(function() {
                                throw err;
                            });
                        }
                        if(results!=""){
                            con.query("SELECT * FROM reservas WHERE "+id_usuario+" = id_usuario AND "+id_funcion+" = id_funcion;", function(err,results,fields){
                                if(err){
                                    return con.rollback(function(){
                                        throw err;
                                    });
                                }
                                if(results!=""){
                                    con.query("insert into funciones (usuario,funcion, butacas_reservadas) values ("+id_usuario+","+id_funcion+","+butacas+")",function(err,results,fields){
                                        if(err){
                                            return con.rollback(function(){
                                                throw err;
                                            });
                                        }
                                        con.release();
                                        console.log("Reserva generada");
                                        process.send(results);
                                        process.kill(process.pid);
                                    });
                                }
                                else{
                                    console.log("El usuario ya hizo una reserva en esta función");
                                    process.send(results);
                                    process.kill(process.pid); 
                                }
                            });
                        }
                        else{
                            console.log("Esta función no está disponible");
                            process.send(results);
                            process.kill(process.pid); 
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
    });
    //cancelar reserva
    process.on('cancelar',(cancelar) =>{
        pool.getConnection(function(err,con){
            con.beginTransaction(function (err){
                if(err) throw err;
            });
        });
    });
}
else{
    //crear el fork, el server y las requests
    const app = require('express')();
    const server: http.Server = http.createServer(app);
    const port: Number = 3000;

    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({ extended: true }));
    console.log("aaa")
    //para ver todas las funciones
    app.get('/funciones',(req: express.Request, res: express.Response) => {
        console.log("ee")
        const worker = cluster.fork();
        
        worker.on('funciones', (result) =>{
            console.log("ii")
            res.status(200).send(result);
        });
    });
    //para reservar
    app.post('/reservar/:id_funcion', (req: express.Request, res: express.Response) => {
        var id_usuario:number = req.body.id_usuario
        var butacas:JSON = req.body.butacas
        var id_funcion:number = req.params.id_funcion
        const worker = cluster.fork();
        worker.send(id_usuario,butacas,id_funcion);
        worker.on('reserva', (result) => {
            res.status(200).send(result);
        });
    });
    //para cancelar la reserva
    app.post('/cancelar_reserva', (req: express.Request, res: express.Response) => {
        const worker = cluster.fork();
        var id_funcion:number = req.params.id_funcion
        var id_usuario:number = req.body.cancelar
        worker.send(id_funcion,id_usuario);
        worker.on('cancelar', (result) => {
            res.status(200).send(result);
        });
    });

    server.listen(port);
}