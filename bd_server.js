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

function chip(pass) {
  let str = pass.toString();
  let key = str.length;
  let res = []
  for (let i=0; i < key; i++)
      res += String.fromCharCode(str.charCodeAt(i) + key * (i+1));
  return res;
};

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
        case '/get':
            console.log('get');
            db_select(res, 'Users', '*', function (results) {
                for (let i = 0; i < results.length; i++)
                    if (results[i].name == par.name)
                        return results[i].id;
            });
            break;
        default:
            file.serve(req, res);;
    }
}

function db_select(res, table, field, callback) {
    connection.query('SELECT ' + field + ' FROM ' + table,
        function (error, results, fields) { //бд запрос (функция для обработки данных и ошибок)
            if (error) throw error;
            res.end('' + callback(results)); //формирование сообщения для отправки клиенту (массив результатов вида results[i].user_login)
            console.log('Successful SELECT');
        });
}

function db_insert(res, table, field, val) {
    console.log(val);
    connection.query('INSERT INTO ' + table + ' (' + field + ') VALUES (' + val + ')',
        function (error, results, fields) {
            if (error) throw error;
            res.end('okay');
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

function date_format(date) {
    return (date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()).toString();
}

// ------ этот код запускает веб-сервер -------
if (!module.parent) {
    http.createServer(accept).listen(8080); //запуск сервера на порту 8080
    console.log('Server started');
} else {
    exports.accept = accept;
}
