var net = require('net');
var fs = require('fs');
var protobuf = require('protocol-buffers');
var messages = protobuf(fs.readFileSync('./Matti.js/protocol.proto'));

module.exports = function(ip, port) {
	
	var newVideoConnection;
	var newKwmConnection;
	
	var client = new net.Socket();
	client.connect(port, ip, function() {
		getAllValues();
	});
	
	var callbacks = {};
	
	client.on('data', function(data) {
		//console.log(response);
		var response = messages.MattiResponse.decode(data);
		if (callbacks[response.ticket]) {
			console.log("not undefined");
			callbacks[response.ticket](response);
			callbacks[response.ticket] = undefined;
		}
		if (response.videoConnection) {
			raiseNewVideoConnection(response.videoConnection.cpu, response.videoConnection.con);
		}
		if (response.videoConnections) {
			console.log("video connections");
			response.videoConnections.videoConnection.forEach(function(c) {
				raiseNewVideoConnection(c.cpu, c.con);
			});
		}
		if (response.kwmConnections) {
			response.kwmConnections.kwmConnection.forEach(function(c) {
				raiseNewKwmConnection(c.con, c.cpu);
			});
		}
	});
	
	function setVideoConnection(cpu, con, callback) {
		var ticket = createTickect();
		if (ticket > -1) {
			var message = messages.MattiRequest.encode({
				ticket,
				videoConnection: {
					cpu,
					con
				}
			});
			callbacks[ticket] = callback;		
			client.write(message);			
		}

	}
	
	function getAllValues(callback) {
		var i = 1;
		var ticket = createTickect();
		if (ticket > -1) {
			var message = messages.MattiRequest.encode( {
				ticket,
				requestValue: {
					values: i
				}
			});
			client.write(message);
		}
	}
	
	function createTickect() {
		for (var i = 1; i < 10000; i++) {
			if (callbacks[i] === undefined) {
				return i;
			}
		}
		return -1;
	}
	
	function raiseNewVideoConnection(cpu, con) {
		console.log("new connection " + cpu + " " + con);
		if (newVideoConnection) {
			newVideoConnection(cpu, con);
		}
	}
	
	function raiseNewKwmConnection(con, cpu) {
		if (newKwmConnection) {
			newKwmConnection(con, cpu);
		}
	}
	
	function setNewVideoConnectionCallback(fn) {
		newVideoConnection = fn;
	}
	
	function setNewKwmConnectionCallback(fn) {
		newKwmConnection = fn;
	}
	
	
	
	return {
		setVideoConnection,
		setNewVideoConnectionCallback,
		setNewKwmConnectionCallback,
		getAllValues
	} 
}
