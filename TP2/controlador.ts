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

app.listen("3000")

app.get('/productos', function(req,res){​​​​​​​​

    let titulo:string =req.query.busqueda;
    let used:string =req.query.usado;
    let orden:string=req.query.orden;


    connection.query("SELECT * FROM productos WHERE nombre LIKE '%"+titulo+"%' AND usado = "+used+" ORDER BY "+orden+";", function (error,results,fields) {
            
        if (error) console.log(error)
        res.json(results);
            
    })
}​​​​​​​​)

app.get("/usuarios/:id_usuario/fav",async function (req,res) {
    var id_usuario:number=req.params.id_usuario

    let consulta="SELECT * FROM productos LEFT JOIN favoritos ON favoritos.id_producto = productos.id WHERE favoritos.id_usuario ="+id_usuario+";"
    
    connection.query(consulta,function(error,results,fields){
        if(error)throw error
        res.json(results)
    })
})

app.post("/usuarios/:id_usuario/fav",async function (req,res) {

    var id_usuario:number=req.params.id_usuario
    var id_producto:number=req.query.id

    let consulta="INSERT INTO favoritos (id_usuario, id_producto) values ("+id_usuario+","+id_producto+");"
    await connection.query(consulta,function(error,results,fields) {
        if(error)throw error
        res.json(results)
        console.log(fields)
    })
})

app.delete("/usuarios/{id_usuario}/fav",async function (req,res){
    
    var id_usuario:number=req.param.id_usuario;
    var id_producto:number=req.query.id_producto;

    let consulta="DELETE from favoritos where id_usuario="+id_usuario+" and id_producto="+id_producto+";"

    connection.query(consulta,function(error,results,fields){
        if(error) throw error
        res.send(fields)
    })
})

app.get("/usuarios/:id_usuario/compras",async function (req,res) {
    var id_usuario:number=req.params.id_usuario
    
    let consulta="SELECT * FROM compras WHERE id_usuario = "+id_usuario+";"
    await connection.query(consulta,function(error,results,fields){
        if(error)throw error
        res.json(results)
    })
})

app.post("/usuarios/{id_usuario}/compras",async function(req,res){

    var id_usuario:number=req.params.id_usuario
    var id_producto:number=req.query.id_producto
    var cantidad:number=req.query.cantidad

    let consulta="INSERT INTO compras (id_usuario, id_producto, cantidad, fecha, comprador_calificado, vendedor_calificado) values ("+id_usuario+","+id_producto+","+cantidad+", CURDATE, 0, 0);"

    await connection.query(consulta,function(error,results,fields){
        if(error)throw error
        res.json(results)
        console.log(fields)
    })
})

app.get("/usuarios/:id_usuario/calificaciones",async function(req,res){
    var id_usuario:number=req.params.id_usuario
    let consultaCompradores="SELECT * FROM calificaciones_compradores WHERE id_comprador="+id_usuario+";"
    let consultaVendedores="SELECT * FROM calificaciones_vendedores where id_vendedor ="+id_usuario+";"
    await connection.query(consultaCompradores,function(error,results1,fields){
        if(error)throw error
        connection.query(consultaVendedores,function(error,results,fields){
            if(error)throw error
            if(results1== ""){
                res.json(results)
            }
            else if(results==""){
                res.json(results1)
            }
            else{
                var resultado=JSON.stringify(results1)+JSON.stringify(results);
                res.json(resultado)
            }
        })
    })

})

app.post("/usuarios/{id_usuario}/calificacioness",async function(req,res){

    //var id_usuario:number=req.params.id_usuario
    //var id_calificante:number=req.query.id_calificante
    //var calificacion:number=req.query.calificacion
    var id_operacion:number=req.query.id_operacion
    
    let consultaOperacion="SELECT productos.vendedor, comprador_calificado, vendedor_calificado FROM compras LEFT JOIN productos ON compras.id_producto = productos.id WHERE compras.id ="+id_operacion+";"
    //let consultaInsert1="INSERT INTO calificaciones_vendedores (id_vendedor, id_comprador, calificacion, fecha) values ("+id_+", ??, ???, CURDATE)"
    
    await connection.query(consultaOperacion,function(error,results,fields){
        if(error) throw error;
        //console.log(results)
        console.log(results[0])

        res.json(results)
    })

    /*if (connection){
        var idOP = id_operacion;
        var valores = [id_usuario, id_calificante, calificacion];
        connection.query({
            sql: "SELECT productos.vendedor, comprador_calificado, vendedor_calificado FROM compras LEFT JOIN productos ON compras.id_producto = productos.id WHERE compras.id = ?",
            tiemout: 40000,
            values: idOP
        }, function (error,results,fields){
            if(error) throw error;
            if(results == id_usuario && results[2] == false){
                //comprador calificando vendedor
                connection.query({
                    sql: "INSERT INTO calificaciones_vendedores (id_vendedor, id_comprador, calificacion, fecha) values (?, ??, ???, CURDATE)",
                    tiemout: 40000,
                    values: valores
                }, function (error,results, fields){
                    if(error) throw error
                    res.json(results)
                    callback(fields)}
                );
            }
            else if (results[1] == false){
                //vendedor calificando comprador
                connection.query({
                    sql: "INSERT INTO calificaciones_compradores (id_comprador, id_vendedor, calificacion, fecha) values (?, ??, ???, CURDATE)",
                    tiemout: 40000,
                    values: valores
                }, function (error,results2,fields){
                    if(error) throw error
                    res.json(results)
                    callback(fields)}
                );
            }
            else if(results[1] || results[2]){
                res.json({"Resultado": "El usuario ya estaba calificado"})
            }
        });
    }*/
})



//"INSERT INTO favoritos (id_usuario, id_producto) values (??, ??)"






/*function getDomain() {
    return result = await dbQuery('SELECT name FROM virtual_domains ORDER BY id;');
}

// * Important promise function
function dbQuery(databaseQuery) {
    return new Promise(data => {
        db.query(databaseQuery, function (error, result) { // change db->connection for your code
            if (error) {
                console.log(error);
                throw error;
            }
            try {
                console.log(result);

                data(result);

            } catch (error) {
                data({});
                throw error;
            }

        });
    });*/