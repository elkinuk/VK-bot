var http = require('http');
var url = require('url'); //поддержка урлов (через /)
var querystring = require('querystring'); //просто лучше не убирать
var static = require('node-static');
var file = new static.Server('.');

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
        case '/':
            break;
        default:
            file.serve(req, res);
    }
}

if (!module.parent) {
    http.createServer(accept).listen(8081);
    console.log('Server started');
} else {
    exports.accept = accept;
}
