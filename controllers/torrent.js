var _ = require("lodash");
var Torrent = require("../models/torrent.js")

module.exports.controller = function (app) {

    var logger = app.get('logger');
    var directories = app.get('deluge-directories');
    var io = app.get('io');
    var torrent = new Torrent(app);

    app.post("/api/torrent", function(req, res) {

        logger.trace("[/api/torrent POST] start");

        var magnetLink = req.query.magnet_link || "";
        var type = req.query.type || "";

        var directory = directories[type] || directories['default'];

        app.get("deluge").add(magnetLink, directory, function(error, result) {
            if (error) {
                logger.error("[/api/torrent POST] an error occurred: " + JSON.stringify(error));
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
        var torrent = new Torrent(app);
        torrent.getTorrents((torrents, error) => {
            if (error) {
                res.status(400).send(JSON.stringify(error));
                return;
            }
            res.send(JSON.stringify(torrents));
        });
    });

    app.get('io').on('connection', function(socket) {
        logger.trace("[socket/torrent_changed] client connected to socket");
        setInterval(() => {
            torrent.getChangedTorrents((torrents, error) => {
                if (error || !torrents) {
                    logger.error("[socket/torrent_changed] an error occurred: " + JSON.stringify(error));
                    return;
                } else if (torrents.length == 0) {
                    logger.trace("[socket/torrent_changed] no torrents changed");
                    return;
                }
                socket.emit('torrent_changed', JSON.stringify(torrents));
            });
        }, 1000);
    });

    app.get("/api/torrent/changed", function(req, res) {
        logger.trace("[/api/torrent/changed GET] start");
        torrent.getChangedTorrents((torrents, error) => {
            if (error) {
                res.status(400).send(JSON.stringify(error));
                return;
            }
            res.send(JSON.stringify(torrents));
        });
    });

};
