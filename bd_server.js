var http = require('http');
var url = require('url'); //поддержка урлов (через /)
var querystring = require('querystring'); //просто лучше не убирать
var static = require('node-static');
var file = new static.Server('.');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbname'
});
let buffer = [];

function accept(req, res) { //основная функция обработки
    let url = "",
        par = "";
    for (let i = 0; i < req.url.length; i++)
        if (req.url[i] == '?') {
            url = req.url.substr(0, i);
            par = querystring.parse(req.url.substr(i + 1));
            break;
        }
    if (url == "") url = req.url; //если просто гет
    switch (url) {
        case '/select':
            console.log('--------select');
            db_select({
                res: res,
                table: par.table,
                fields: par.fields,
                wfield: par.wfield,
                wval: `"${par.wval}"`,
                callback: function (results) {
                    return JSON.stringify(results);
                }
            });
            break;
        case '/insert':
            console.log('--------insert');
            db_insert({
                res: res,
                table: par.table,
                field: par.field,
                val: `"${par.val}"`
            });
            break;
        case '/update':
            console.log('--------update');
            db_update({
                res: res,
                table: par.table,
                field: par.field,
                val: `${par.val}`,
                wfield: par.wfield,
                wval: `"${par.wval}"`
            });
            break;
        case '/delete':
            console.log('--------delete');
            db_delete({
                res: res,
                table: par.table,
                wfield: par.wfield,
                wval: `"${par.wval}"`
            });
            break;
        case '/setOrder':
            console.log('--------set order');
            buffer.push({name: par.name,email: par.email,phone: par.phone,uid: par.uid,details: par.details});
            break;
        case '/getOrder':
            console.log('--------get order');
            res.end('' + JSON.stringify(buffer));
            buffer = [];
            break;
        default:
            file.serve(req, res);
    }
}

function db_select(args) { //fields, table, res, callback, wfield, wval
    let where_condition = args.wfield == undefined ? 1 : `${args.wfield}=${args.wval}`
    connection.query(`SELECT ${args.fields} FROM ${args.table} WHERE ${where_condition}`,
        function (error, results, fields) { //бд запрос (функция для обработки данных и ошибок)
            if (error) throw error;
            args.res.end('' + args.callback(results)); //формирование сообщения для отправки клиенту
            console.log('Successful SELECT');
        });
}

function db_insert(args) {
    connection.query(`INSERT INTO ${args.table} (${args.field}) VALUES (${args.val})`,
        function (error, results, fields) {
            if (error) throw error;
            args.res.end('okay');
            console.log('Successful INSERT');
        });
}

function db_delete(args) {
    connection.query(`DELETE FROM ${args.table} WHERE ${args.wfield} = ${args.wval}`,
        function (error, results, fields) {
            if (error) throw error;
            args.res.end('okay');
            console.log('Successful DELETE');
        });
}

function db_update(args) {
    connection.query(`UPDATE ${args.table} SET ${args.field}="${args.val}" where ${args.wfield}=${args.wval}`,
        function (error, results, fields) {
            if (error) throw error;
            args.res.end('okay');
            console.log('Successful UPDATE');
        });
}

// ------ этот код запускает веб-сервер -------
if (!module.parent) {
    http.createServer(accept).listen(8080);
    console.log('Server started');
} else {
    exports.accept = accept;
}
