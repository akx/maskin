var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./index.js",
    output: {
        path: "dist",
        filename: "bundle.js",
    },
    module: {
        loaders: [
            {test: /\.json$/, loader: "json-loader"},
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components|lib)/,
                loader: "babel"
            }
        ]
    },
    resolve: {
        alias: {
            Tone: __dirname + '/lib/Tone.js'
        }
    },
    plugins: [new HtmlWebpackPlugin({title: "maskin"})]
};
