var spawn = require('child_process').spawn,
//child = spawn('/opt/vc/bin/raspivid', ['-t', '0', '-w', '800', '-h', '600', /*'-hf'*/, '-fps', '30', '-o', '-' ]);


child = spawn('ffmpeg', ['-f' ,'v4l2', '-framerate', '25', '-video_size', '640x480', '-i','/dev/video0' , '$out']);
var http = require("http");
var server = http.createServer(function(request, response) {

console.log("received request");
child.stdout.pipe(response);

});



server.listen(3000);
console.log("Server is listening");