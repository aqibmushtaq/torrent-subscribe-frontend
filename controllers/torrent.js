var _ = require("lodash");

module.exports.controller = function (app) {

    var logger = app.get("logger");
    var directories = app.get('deluge-directories');

    app.post("/api/torrent", function(req, res) {

        logger.trace("[/api/torrent POST] start");

        var magnetLink = req.query.magnet_link || "";
        var type = req.query.type || "";

        var directory = directories[type] || directories['default'];

        app.get("deluge").add(magnetLink, directory, function(error, result) {
            if (error) {
                logger.trace("[/api/torrent POST] an error occurred: " + JSON.stringify(error));
                res.status(400).send("an error occurred: " + JSON.stringify(error));
                return;
            }
            logger.info('[/api/torrent POST] downloading to directory: %s', directory);
            logger.trace("[/api/torrent POST] success");
            res.send(200);
        });
    });

    app.get("/api/torrent", function(req, res) {
        logger.trace("[/api/torrent GET] start");

        app.get("node-deluge").get_status(function(result) {
            logger.trace("[/api/torrent GET] success: " + JSON.stringify(result));
            if (!_.has(result, "result.torrents")) {
                res.status(400).send(JSON.stringify(result));
                return;
            }
            res.send(JSON.stringify(result.result.torrents));
        });
    });

};
