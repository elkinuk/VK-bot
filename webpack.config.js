module.exports = {
    entry: './js/client.js',
    output: {
        path: __dirname + "/js",
        filename: 'index.js'
    },
    devServer: {
        inline: true,
        port: 8000
    }
}
