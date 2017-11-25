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
            console.log('select');
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
            console.log('insert');
            db_insert({
                res: res,
                table: par.table,
                field: par.field,
                val: `"${par.value}"`
            });
            break;
        default:
            file.serve(req, res);
    }
}

function date_format(date) {
    return (date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()).toString();
}

function db_select(args) { //fields, table, res, callback, wfield, wval
    let where_condition = args.wfield == undefined ? 1 : `${args.wfield}=${args.wval}`
    connection.query(`SELECT ${args.fields} FROM ${args.table} WHERE ${where_condition}`,
        function (error, results, fields) { //бд запрос (функция для обработки данных и ошибок)
            if (error) throw error;
            args.res.end('' + args.callback(results)); //формирование сообщения для отправки клиенту (массив результатов вида results[i].user_login)
            console.log('Successful SELECT');
        });
}

function db_insert(args) { //field, table, res, val
    connection.query('INSERT INTO ' + args.table + ' (' + args.field + ') VALUES (' + args.val + ')',
        function (error, results, fields) {
            if (error) throw error;
            args.res.end('okay');
            console.log('Successful INSERT');
        });
}

function db_update(res, table, field, val, wfield, wval) {
    connection.query('update ' + table + ' set ' + field + '="' + val + '" where ' + wfield + '=' + wval,
        function (error, results, fields) {
            if (error) throw error;
            res.end('okay');
            console.log('Successful UPDATE');
        });
}

function db_edit(res, table, field, val, id) {
    db_select(res, table, '*', function (results) {
        for (let i = 0; i < results.length; i++)
            if (results[i].user_ID == id) {
                db_update(res, table, field, val, 'user_ID', id);
                console.log('Successful EDIT');
                return null;
            }
    });
}

// ------ этот код запускает веб-сервер -------
if (!module.parent) {
    http.createServer(accept).listen(8080); //запуск сервера на порту 8080
    console.log('Server started');
} else {
    exports.accept = accept;
}
