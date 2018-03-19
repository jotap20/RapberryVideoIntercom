/**
 * Created by joao on 6/3/17.
 */

 var http = require('http'),
 url = require('url'),
 path = require('path'),
 fs = require('fs');
var chokidar = require('chokidar');
var mimeTypes = {
 "html": "text/html",
 "jpeg": "image/jpeg",
 "jpg": "image/jpeg",
 "png": "image/png",
 "js": "text/javascript",
 "css": "text/css",
 "ts": "video/MP2T",
 "m3u8": "application/x-mpegURL"
};

var watcher = chokidar.watch('/home/joao/WebstormProjects/nodeHlsServer/Streams');
//watcher.on('add', function(path) {console.log('File', path, 'has been added');});

http.createServer(function (req, res) {

 var uri = url.parse(req.url).pathname;
 var filename = path.join(process.cwd(), unescape(uri));
 var stats;
 console.log(req.body);

 console.log(req.method + "URI: " + uri);
 var contentType = res.headers['content-type'];
 if (req.method == 'POST') {
     var file = req.body;
     var parts2 = uri.split("/");

     if (uri.split(".")[1] === 'm3u8') {
         console.log(parts2[parts2.length]);

         fs.writeFile(parts2[parts2.length], file, "m3u8", function (err) {
             if (err) return console.log(err);
             console.log('Hello World > helloworld.txt');
         });

     } else if (uri.split(".")[1] === 'ts') {

         fs.writeFile("lol", file, function (err) {
             if (err) return console.log(err);
             console.log('Hello World > helloworld.txt');
         });

     }

 }
 if (uri == '/player.html') {
     res.writeHead(200, {'Content-Type': 'text/html'});
     res.write('<html><head><title>HLS Player fed by node.js' +
         '</title></head><body>');
     res.write('<video src="http://' + "127.0.0.1" +
         ':' + 8000 + '/Streams/output.m3u8" type="application/x-mpegURL" controls autoplay ></body></html> ');
     console.log(req.socket.localAddress);
     res.end();
     return;
 }
 console.log('filename ' + filename);

 try {
     stats = fs.lstatSync(filename); // throws if path doesn't exist
 } catch (e) {
     watcher.on('add', function (path) {
         console.log(path);
         var mimeType = mimeTypes[path.split(".")[1]];
         res.writeHead(200, {'Content-Type': mimeType});

         var fileStream = fs.createReadStream(filename);
         fileStream.pipe(res);
         console.log('File', path, 'has been added');
     });
     return;
 }


 if (stats.isFile()) {
     // path exists, is a file
     var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
     res.writeHead(200, {'Content-Type': mimeType});

     var fileStream = fs.createReadStream(filename);
     fileStream.pipe(res);
 } else if (stats.isDirectory()) {
     // path exists, is a directory
     res.writeHead(200, {'Content-Type': 'text/plain'});
     res.write('Index of ' + uri + '\n');
     res.write('TODO, show index?\n');
     res.end();
 } else {
     // Symbolic link, other?
     // TODO: follow symlinks?  security?
     res.writeHead(500, {'Content-Type': 'text/plain'});
     res.write('500 Internal server error\n');
     res.end();
 }

}).listen(8000);
