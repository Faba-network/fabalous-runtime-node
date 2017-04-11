/*
     var MemoryFS = require("memory-fs");
     var webpack = require("webpack");

     var fs = new MemoryFS();
     var compiler = webpack({ ... });
     compiler.outputFileSystem = fs;
     compiler.run(function(err, stats) {
     // ...
     var fileContent = fs.readFileSync("...");
     });
 */

module.exports = function(gulp){
    var path = require('path');
    var nodemon = require('nodemon');
    var webpack = require('webpack');
    var ProgressBarPlugin = require('progress-bar-webpack-plugin');

    var nodeConfig = require(path.join(__dirname + "/../webpack/WebpackRuntimeWeb.config.js"));
    function onBuild(done) {
        return function(err, stats) {
            if(err)console.error('Error', err);
            else console.log(stats.toString());
            if(done) done();
        }
    }

    gulp.task('runtime-node-build', function(done) {
        webpack(nodeConfig).run(onBuild(done));
    });

    gulp.task('runtime-node-watch', ['node-wbp'], function() {
        nodemon({
            execMap: {
                js: 'node'
            },
            script: path.join(__workDir, './dist/node/server.js'),
            ignore: ['*'],
            watch: ['foo/'],
            ext: 'noop'
        }).on('restart', function(){

        });
    });

    gulp.task('node-wbp', function(done) {
        var firedDone = false;
        webpack(nodeConfig).watch(100, function(err, stats) {
            console.log(stats.toString({
                chunks: false, // Makes the build much quieter
                colors: true
            }));
            if(!firedDone) {
                firedDone = true;
                done();
            }
            nodemon.restart();
        });
    });
};