var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var express = require("express");
var mysql = require("mysql");
var app = express();
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "ecommerce",
    port: "3306"
});
connection.connect(function (err) {
    if (err) {
        throw err;
    }
    else {
        console.log("conectó");
    }
});
app.listen("3000");
app.get('/productos', function (req, res) {
    var titulo = req.query.busqueda;
    var used = req.query.usado;
    var orden = req.query.orden;
    connection.query("SELECT * FROM productos WHERE nombre LIKE '%" + titulo + "%' AND usado = " + used + " ORDER BY " + orden + ";", function (error, results, fields) {
        if (error)
            console.log(error);
        res.json(results);
    });
});
app.get("/usuarios/:id_usuario/fav", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id_usuario, consulta;
        return __generator(this, function (_a) {
            id_usuario = req.params.id_usuario;
            consulta = "SELECT * FROM productos LEFT JOIN favoritos ON favoritos.id_producto = productos.id WHERE favoritos.id_usuario =" + id_usuario + ";";
            connection.query(consulta, function (error, results, fields) {
                if (error)
                    throw error;
                res.json(results);
            });
            return [2 /*return*/];
        });
    });
});
app.post("/usuarios/:id_usuario/fav", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id_usuario, id_producto, consulta;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id_usuario = req.params.id_usuario;
                    id_producto = req.query.id;
                    consulta = "INSERT INTO favoritos (id_usuario, id_producto) values (" + id_usuario + "," + id_producto + ");";
                    return [4 /*yield*/, connection.query(consulta, function (error, results, fields) {
                            if (error)
                                throw error;
                            res.json(results);
                            console.log(fields);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
app["delete"]("/usuarios/{id_usuario}/fav", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id_usuario, id_producto, consulta;
        return __generator(this, function (_a) {
            id_usuario = req.param.id_usuario;
            id_producto = req.query.id_producto;
            consulta = "DELETE from favoritos where id_usuario=" + id_usuario + " and id_producto=" + id_producto + ";";
            connection.query(consulta, function (error, results, fields) {
                if (error)
                    throw error;
                res.send(fields);
            });
            return [2 /*return*/];
        });
    });
});
app.get("/usuarios/:id_usuario/compras", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id_usuario, consulta;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id_usuario = req.params.id_usuario;
                    consulta = "SELECT * FROM compras WHERE id_usuario = " + id_usuario + ";";
                    return [4 /*yield*/, connection.query(consulta, function (error, results, fields) {
                            if (error)
                                throw error;
                            res.json(results);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
app.post("/usuarios/{id_usuario}/compras", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id_usuario, id_producto, cantidad, consulta;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id_usuario = req.params.id_usuario;
                    id_producto = req.query.id_producto;
                    cantidad = req.query.cantidad;
                    consulta = "INSERT INTO compras (id_usuario, id_producto, cantidad, fecha, comprador_calificado, vendedor_calificado) values (" + id_usuario + "," + id_producto + "," + cantidad + ", CURDATE, 0, 0);";
                    return [4 /*yield*/, connection.query(consulta, function (error, results, fields) {
                            if (error)
                                throw error;
                            res.json(results);
                            console.log(fields);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
app.get("/usuarios/:id_usuario/calificaciones", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id_usuario, consultaCompradores, consultaVendedores;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id_usuario = req.params.id_usuario;
                    consultaCompradores = "SELECT * FROM calificaciones_compradores WHERE id_comprador=" + id_usuario + ";";
                    consultaVendedores = "SELECT * FROM calificaciones_vendedores where id_vendedor =" + id_usuario + ";";
                    return [4 /*yield*/, connection.query(consultaCompradores, function (error, results1, fields) {
                            if (error)
                                throw error;
                            connection.query(consultaVendedores, function (error, results, fields) {
                                if (error)
                                    throw error;
                                if (results1 == "") {
                                    res.json(results);
                                }
                                else if (results == "") {
                                    res.json(results1);
                                }
                                else {
                                    var resultado = JSON.stringify(results1) + JSON.stringify(results);
                                    res.json(resultado);
                                }
                            });
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
app.post("/usuarios/{id_usuario}/calificacioness", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id_operacion, consultaOperacion;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id_operacion = req.query.id_operacion;
                    consultaOperacion = "SELECT productos.vendedor, comprador_calificado, vendedor_calificado FROM compras LEFT JOIN productos ON compras.id_producto = productos.id WHERE compras.id =" + id_operacion + ";";
                    //let consultaInsert1="INSERT INTO calificaciones_vendedores (id_vendedor, id_comprador, calificacion, fecha) values ("+id_+", ??, ???, CURDATE)"
                    return [4 /*yield*/, connection.query(consultaOperacion, function (error, results, fields) {
                            if (error)
                                throw error;
                            //console.log(results)
                            console.log(results[0]);
                            res.json(results);
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
                    ];
                case 1:
                    //let consultaInsert1="INSERT INTO calificaciones_vendedores (id_vendedor, id_comprador, calificacion, fecha) values ("+id_+", ??, ???, CURDATE)"
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
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
