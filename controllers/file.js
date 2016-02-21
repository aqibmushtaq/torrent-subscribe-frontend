var _ = require('lodash');
var dirTree = require('directory-tree');
var archiver = require('archiver');
var fs = require('fs');

module.exports.controller = function (app) {

    var logger = app.get('logger');
    var directories = app.get('deluge-directories');

    app.get('/api/files', function(req, res) {
        var directoryType = req.query.directory_type;
        var directory = directories[directoryType] || directories['default'];
        logger.trace("[/api/files GET] start, type=" + directoryType + ", dir=" + directory);

        // var filteredTree = dirTree.directoryTree('/Users/aqib.mushtaq/Desktop', ['.jpg', '.png']);
        var filteredTree = dirTree.directoryTree(directory);
        // res.json(filteredTree);
        res.status(200).send(JSON.stringify(filteredTree));
    });

    app.get('/api/files/directories', function(req, res) {
        res.json(Object.keys(directories));
    });

    app.get('/api/files/download', function(req, res) {
        var directoryType = req.query.directory_type;
        var directory = directories[directoryType] || directories['default'];
        logger.trace("[/api/files GET] start, type=" + directoryType + ", dir=" + directory);

        var path = directory + '/' + (req.query.path || '');
        logger.trace("[/api/files GET] path" + path);

        //if file then serve as is
        try {
            var stat = fs.statSync(path);
        } catch (e) {
            res.send(404);
        }
        if (stat.isFile()) {
            res.sendfile(path);
            return;
        }

        //found a directory, zip it up
        var filename = _.last(path.split('/'));
        if (filename == '')
            filename = 'root';
        var archive = archiver('zip');
        archive.on('error', function(err) {
            res.status(500).send({error: err.message});
        });

        //on stream closed we can end the request
        archive.on('end', function() {
            console.log('Archive wrote %d bytes', archive.pointer());
        });

        //set the archive name
        res.attachment(filename + '.zip');

        //this is the streaming magic
        archive.pipe(res);

        //add the directory
        archive.directory(path, "");

        archive.finalize();
    });

};
