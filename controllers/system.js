var _ = require('lodash');
var diskspace = require('diskspace');
var async = require('async');

module.exports.controller = function (app) {

    var logger = app.get("logger");
    var directories = app.get('deluge-directories');

    app.get("/api/system/space", function(req, res) {

        logger.trace("[/api/system/space GET] start = " + JSON.stringify(directories));

        var directoryPaths = _.values(directories);
        var invertedDirectories = _.invert(directories);

        async.map(directoryPaths, (directoryPath, callback) => {
            diskspace.check(directoryPath, (error, total, free, status) => {
                logger.trace("[/api/system/space GET] directoryPath: " + directoryPath);
                callback(null, {label: invertedDirectories[directoryPath], total: total, free: free});
            });
        },
        (error, results) => {
            if (error) {
                logger.error("[/api/system/space GET] error: " + JSON.stringify(error));
                res.send(400);
            }
            var json = JSON.stringify({result: results});
            logger.trace("[/api/system/space GET] success: " + json);
            res.status(200).send(json);
        });
    });

};
