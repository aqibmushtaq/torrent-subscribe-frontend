var _ = require("lodash");
var async = require("async");

function Torrent(app) {
    this.app = app;
    console.log("Torrent: this.app: " + this.app)
    this.logger = this.app.get("logger");
    this.logger.trace("[torrent] start");
    this.torrents = [];

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
        this.logger.trace("[torrent.getChangedTorrents] getting changed torrents");
        this.getTorrents((newTorrents, error) => {
            if (error) {
                this.logger.trace("[torrent.getChangedTorrents] error");
                cb(torrents, error);
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
            this.logger.trace("[torrent.getChangedTorrents] found " + changedTorrents.length + " changed torrents");
            cb(changedTorrents);
        });
    };

};

module.exports = Torrent;
