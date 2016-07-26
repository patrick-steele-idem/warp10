var fs = require('fs');
var path = require('path');

var benchmarksDir = path.join(__dirname, 'benchmarks');

fs.readdirSync(benchmarksDir).forEach(function(suiteName) {
    var dir = path.join(benchmarksDir, suiteName);
    if (!fs.statSync(dir).isDirectory()) {
        return;
    }

    suite(suiteName, function() {
        fs.readdirSync(dir).forEach(function(benchFile) {
            if (!benchFile.endsWith('.js') || benchFile === 'data.js') {
                return;
            }

            var dataFile = path.join(dir, 'data.js');
            if (!fs.existsSync(dataFile)) {
                return;
            }

            var data = require(dataFile);
            var benchName = benchFile.slice(0, -3);

            benchFile = path.join(dir, benchFile);


            var benchFunc = require(benchFile);
            bench(benchName, function() {
                benchFunc(data);
            });
        });
    });
});