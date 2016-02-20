var _ = require("lodash");
var async = require("async");

function Torrent(app) {
    this.app = app;
    console.log("Torrent: this.app: " + this.app)
    this.logger = this.app.get("logger");
    this.logger.trace("[torrent] start");
    this.torrents = [];
    this.changedTorrents = [];
    this.sockets = [];

    this.attachSocket = (socket) => {
        var socketIndex = _.findIndex(this.sockets, {id: socket.id});
        if (socketIndex < 0) {
            this.sockets.push(socket);
            return;
        }
        this.sockets[socketIndex] = socket;
    };

    this.detachSocket = (socket) => {
        this.sockets = this.sockets.filter((s) => {
            s.id == socket.id;
        });
    };

    this.notifySockets = () => {
        this.sockets.forEach((socket) => {
            socket.emit('torrent_changed', JSON.stringify(this.getStaleChangedTorrents()));
        });
    };

    this.getStaleTorrents = () => {
        return this.torrents;
    };

    this.getStaleChangedTorrents = () => {
        return this.changedTorrents;
    };

    this.getTorrents = (cb) => {
        this.app.get("node-deluge").get_status(function(result) {
            if (!_.has(result, "result.torrents")) {
                this.logger.error("[torrent.getTorrents] failed: " + JSON.stringify(result));
                cb({}, result);
                return;
            }
            var newTorrents = result.result.torrents;
            var newTorrentsArr = [];
            Object.keys(newTorrents).forEach((key) => {
                var torrent = newTorrents[key];
                torrent.id = key;
                newTorrentsArr.push(torrent);
            });
            cb(newTorrentsArr);
        }.bind(this));
    };

    this.getChangedTorrents = (cb) => {
        this.getTorrents((newTorrents, error) => {
            if (error) {
                this.logger.trace("[torrent.getChangedTorrents] error");
                setTimeout(this.getChangedTorrents, 1000);
                if (cb) cb(torrents, error);
                return;
            }
            var changedTorrents = [];
            newTorrents.forEach((newTorrent) => {
                var torrentIndex = _.findIndex(this.torrents, {id: newTorrent.id});
                // new torrent or changed torrent
                if (torrentIndex < 0 || !_.isEqual(this.torrents[torrentIndex], newTorrent))
                    changedTorrents.push(newTorrent);
            });
            this.torrents = newTorrents;
            this.changedTorrents = changedTorrents;

            if (changedTorrents.length > 0) {
                this.notifySockets();
            }

            // run again once complete
            setTimeout(this.getChangedTorrents, 1000);
            if (cb) cb(changedTorrents);
        });
    };
    this.getChangedTorrents();
};

module.exports = Torrent;
