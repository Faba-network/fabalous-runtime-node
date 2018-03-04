var path = require('path');
var fs = require('fs');
var webpack = require('webpack');

var entry = ['./src/A_Server.ts'];
var ProgressBarPlugin = require('progress-bar-webpack-plugin');

function getGitHash(){
    try {
        return __gitHash;
    } catch (e){
        return "";
    }
}

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

function getAlias(){
    try {
        return __alias;
    } catch (e){
        return {};
    }
}

function getMaxFileSize(){
    try {
        return __maxAssetSize;
    } catch (e){
        return 100000
    }
}

module.exports = {
    entry:entry,
    target:'node',
    output: {
        path: path.join(__workDir, './dist/node/'),
        filename: 'server.js'
    },

    node: {
        __dirname: true,
        __filename: true
    },
    externals:nodeModules,

    devtool: 'source-map',
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        alias: getAlias()
    },

    recordsPath: path.join(__workDir, './dist/node/_records'),

    stats: "minimal",
    mode:"development",
    module: {
        rules: [
            {
                loader: 'ts-loader',
                query: {
                    transpileOnly: true,
                    configFile:path.join(path.join(__workDir, './node_modules/@fabalous/runtime-node/config/tsconfig.node.json'))
                }
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg|mp3|mp4)$/,
                loader: `url-loader?limit=${getMaxFileSize()}&name=assets/[name]_${getGitHash()}.[ext]`,
                include: [
                    path.join(__workDir, './src/')
                ]
            }
        ],
    },

    plugins:[
        new webpack.DefinePlugin({
            'process.env.NODE_ENV':  JSON.stringify("development"),
            'process.env.FABALOUS_RUNTIME': JSON.stringify("node"),
            'process.env.FABALOUS_DEBUG': JSON.stringify(1),
            'process.env.HASH': JSON.stringify(getGitHash())

        }),
        new ProgressBarPlugin(),
        new webpack.NamedModulesPlugin()
    ]
};