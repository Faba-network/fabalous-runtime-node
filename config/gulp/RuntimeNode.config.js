module.exports = function(gulp){
    var path = require('path');
    var nodemon = require('nodemon');
    var webpack = require('webpack');

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
            script: path.join(__workDir, './build/node/server.js'),
            ignore: ['*'],
            watch: ['foo/'],
            ext: 'noop'
        }).on('restart', function(){

        });
    });

    gulp.task('backend-wbp', function(done) {
        var firedDone = false;
        webpack(backendConfig).watch(100, function(err, stats) {
            console.error(err);
            console.log(stats);
            if(!firedDone) {
                firedDone = true;
                done();
            }
            nodemon.restart();
        });
    });
};