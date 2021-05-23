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
    password: "password",
    database: "Cine"
});

if(cluster.isWorker){
    //atender a requests
    //reservar
    //
    
    process.on('reservar',(id_usuario, butacas, id_funcion)=>{
        pool.getConnection(function(err, con){
            if(err) throw err;
            con.beginTransaction(function(err){
                if(err) throw err;  
                con.query("SELECT * FROM reservas WHERE ? = id_usuario AND ? = id_funcion;",[id_usuario,id_funcion], function(err,results,fields){
                    if (err) {
                        return con.rollback(function() {
                            throw err;
                        });
                    }
                    if(results!=""){
                        con.query("select butacas_disponibles from funciones where id= ? and curdate()<fecha and butacas_disponibles not like '[]'",[id_funcion],function (err,results,fields){
                            if(err) return con.rollback(function(){
                                throw err;
                            });
                            if(results!="[]"){
                                //verificacion que las butacas que seleccionó el usuario estén incluidas en las disponibles
                                if(true){
                                    con.query("insert into reservas (usuario,funcion,butacas) values (?,?,?)",[id_usuario,id_funcion,butacas],function (err,results,fields){
                                        if(err) return con.rollback(function(){
                                            throw err;
                                        });
                                        con.release();
                                        process.send("Reserva generada con éxito");
                                        process.kill(process.pid);
                                    })
                                }
                                else{
                                    con.release();
                                    process.send("las butacas elegidas no están disponibles");
                                    process.kill(process.pid);  
                                }
                            }
                            else{
                                con.release();
                                process.send("no quedan butacas disponibles en esta función");
                                process.kill(process.pid);
                            }
                        })
                    }
                    else{
                        con.release()
                        process.send("El usuario ya ha hecho una reserva de esta función");
                        process.kill(process.pid);
                    }
                });
            });
        });
    });

    //cancelar reserva
    process.on('cancelar',(id_funcion,id_usuario) =>{
        pool.getConnection(function(err,con){
            con.beginTransaction(function(err){
                if(err) throw err;
                con.query("select * from reservas where "+id_funcion+" = funcion and "+id_usuario+" = usuario;", function (err,results,fields){
                    if (err) {
                        return con.rollback(function() {
                            throw err;
                        });
                    }
                    if(results!=""){
                        con.query("delete from reservas where "+id_funcion+" = funcion and "+id_usuario+" = usuario;", function (err,results,fields){
                            if (err) {
                                return con.rollback(function() {
                                    throw err;
                                });
                            }
                            else{
                                console.log(`La reserva ha sido eliminada`);
                                process.send(null);
                                process.kill(process.pid);
                            }
                        });
                    }
                    else{
                        con.release();
                        process.send("no existen reservas a nombre de este usuario");
                        process.kill(process.pid);
                    }
                });
            });
            
        });
    });
}
else{
    //crear el fork, el server y las requests
    const app = require('express')();
    const server: http.Server = http.createServer(app);
    const port: Number = 3000;

    console.log("Api de cine");

    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({ extended: true }));
    
    //para ver todas las funciones
    app.get('/funciones',(req: express.Request, res: express.Response) => {
        pool.getConnection(function(err, con){
            con.beginTransaction(function(err){
                if(err) throw err;
                con.query("SELECT * FROM funciones WHERE CURDATE() < fecha and butacas_disponibles not LIKE '[]';",function(err,results,fields){
                    
                    if (err) throw err;
                    if(results==''){
                        res.json("no hay funciones disponibles");
                    }
                    console.log(`Funciones obtenidas`);
                    res.json(results);    
                });
            });
        });
    });
    //para reservar
    app.post('/reservar/:id_funcion', (req: express.Request, res: express.Response) => {
        console.log("ee");
        var id_funcion:number = req.params.id_funcion
        var id_usuario:number = req.body.id_usuario
        var butacas:string = req.body.butacas
        
        console.log(butacas);
        const worker = cluster.fork();
        worker.send(id_usuario,butacas,id_funcion);
        worker.on('reservar', (result) => {
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