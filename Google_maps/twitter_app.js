var http = require('http');
var url = require('url');
var fs = require('fs');
var io = require('socket.io');
var port = 8888;

var server = http.createServer(function(request, response){
	var file_path = "";
	var mimes = {
		'css':  'text/css',
		'js':   'text/javascript',
		'htm':  'text/html',
		'html': 'text/html',
	};
	
	var url_request = url.parse(request.url).pathname;
	var tmp  = url_request.lastIndexOf(".");// location of the last "." in the url
	var ext  = url_request.substring((tmp + 1));
	
	//set path of index page
	if(url_request == "/" || url_request == "/index.html"){
		file_path = "index.html";
	}
	//set path of static pages
	if (ext == 'css' || ext == 'js' || ext == 'htm' || ext == 'html'){
		file_path = url_request.replace("/", "");
	}

	//load needed pages and static files
	fs.readFile(file_path, function(error, data){
		if(error){
			response.writeHeader(500, {"Content-Type": "text/html"});
			response.write("<h1>Internal Server Error!</h1>");
		}
		else{
			response.writeHeader(200, {"Content-Type": mimes[ext]});
			response.write(data);
		}

		response.end();
	});
}).listen(port);
console.log("listening on port "+port);

//have socket io listen to server
var sockets = io.listen(server);

//listening to connection event
sockets.on('connection', function (socket){
	// each new socket that comes in will execute this code
	// this section is run by the server
	console.log("Someone NEW joined");

	// server emits this event to ALL sockets currently connected
	// sockets.sockets.emit("hello");
	
	// socket.on('add_marker', function(){
	// 	console.log("MORE MARKERS");
	// });

	// listens for a socket emitting an event
	// socket.on('send_key', function (){
	//	// server tells the socket who emitted to emit this event to all OTHER sockets, EXCEPT itself
	// 	socket.broadcast.emit('display_key');
	// });
});

setInterval(function(){
	sockets.sockets.emit('displ_locs', gatherNewLocs(Math.ceil(Math.random() * 20)));
}, 2000);

function gatherNewLocs(num_of_locs){
	locs = [];
	for (var i=0; i<num_of_locs; i++){
		locs.push({
			lat : Math.random()*170-85,
			lon : Math.random()*360-180});
	}
	return locs;
}