var dataModels = {
//1
//titulo es parametro en la funcion que selecciona esta query
getProductoByTitulo: (callback)=> {
    var valores = [titulo+"%", used, orden];
    connection.query({
        sql: "SELECT * FROM productos LEFT JOIN compras ON compras.id_producto = productos.id_producto WHERE 'nombre' LIKE ? AND usado = ?? ORDER BY ???",
        tiemout: 40000,
        values: valores
    }, function (error,results, fields){
        if(error) throw error
        callback(fields)});
}
//2
getFavoritos: (callback)=> {
    if(connection){
        var valores = id_usuario;
        connection.query({
            sql: "SELECT * FROM productos LEFT JOIN favoritos ON favoritos.id_producto = productos.id_producto WHERE favoritos.id_usuario == ?",
            tiemout: 40000,
            values: valores
        }, function (error,results, fields){
            if(error) throw error
            callback(fields)});
    }
}
//3
//id_usuario e id_producto son parametros en la funcion que selecciona esta query
postFavorito: (callback)=> {
    if (connection){
        var valores = [id_usuario, id_producto];
        connection.query({
            sql: "INSERT INTO favoritos (id_usuario, id_producto) values (??, ??)",
            tiemout: 40000,
            values: valores
        }, function (error,results, fields){
            if(error) throw error
            callback(fields)});
    }
}
//4
//id_usuario e id_producto son parametros en la funcion que selecciona esta query
deleteFavorito: (callback)=> {
    if (connection){
        var valores = [id_usuario, id_producto];
        connection.query({
            sql: "DELETE FROM favoritos WHERE id_usuario = ?? AND id_producto = ??",
            tiemout: 40000,
            values: valores
        }, function (error,results, fields){
            if(error) throw error
            callback(fields)});
    }
}
//5
//id_usuario es un parametro en la funcion que selecciona esta query
getCompra: (callback)=> {
    if (connection){
        var valores = id_usuario;
        connection.query({
            sql: "SELECT * FROM compras WHERE id_usuario = ?",
            tiemout: 40000,
            values: valores
        }, function (error,results, fields){
            if(error) throw error
            callback(fields)});
    }
}
//6
//id_producto, cantidad, comprador y vendedor son parametros en la funcion que selecciona esta query
postCompra: (callback)=> {
    if (connection){
        var valores = [this.id_usuario, id_producto, cantidad, comprador, vendedor];
        connection.query({
            sql: "INSERT INTO compras (id_usuario, id_producto, cantidad, fecha, comprador_calificado, vendedor_calificado) values (??, ??, ??, CURDATE, ??, ??);",
            tiemout: 40000,
            values: valores
        }, function (error,results, fields){
            if(error) throw error
            callback(fields)});
    }
}
//7
//id_usuario es un parametro en la funcion que selecciona esta query
getCalificaciones: (callback)=> {
    if (connection){
        var valores = id_usuario;
        connection.query({
            sql: "SELECT calificacion_vendedor, calificacion_comprador FROM usuarios WHERE id_usuario = ?",
            tiemout: 40000,
            values: valores
        }, function (error,results, fields){
            if(error) throw error
            callback(fields)}
        );
    }
}
//8
postCalificaciones: (callback)=> {
    if (connection){
        var valores = [id_calificante, id_operacion];
        connection.query({
            sql: "SELECT ",
            tiemout: 40000,
            values: valores
        }, function (error,results, fields){
            if(error) throw error
            callback(fields)}
        );
    }
}