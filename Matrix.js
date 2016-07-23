var net = require('net');

module.exports = function(id, manager) {
	var that = {};
	var cpuPorts = [];
	var videoStates = [];

	var con = 16;
	var cpu = 16;

	var ip;
	var port;

	
	var client = new net.Socket();


	client.on('data', function(data) {
		if (data[0] === 2) {
			console.log(data[1]);
			switch(data[1]) {
				case 71: // Video connection to
					console.log("new video connection");
				break;
				case 72:
				break;
				case 73:
				break;
				case 74:
				break;
				case 75:
				break;
				case 76:
				break;
				case 77:
				break;
				case 78:
				break;
				case 79:
				break;
				case 80:
				break;
				case 81:
				break;
				case 82:
				break;
				case 83:
				var i;
				for (i = 1; i < con+1; i++) {
						videoStates[i] = data[i+1]-128;
						if (that.newVideoState) {
							that.newVideoState(i, videoStates[i]);
						}
				}
				break;
			}
		}
	});

	that.getId = function () {
		return id;
	}

	manager.getIpAndPortForMatrix(that, function (ip, port) {
		client.connect(port, ip, function() {
		});
	});

	that.setVideoConnection = function (cpuPort, conPort) {
		console.log(cpuPort);
		if (client.destroyed) {
			manager.getIpAndPortForMatrix(that, function (ip, port) {
				client.connect(port, ip, function () {
					client.write(new Buffer([2, 71, conPort, cpuPort, 03]));
				});
			});
		} else {
			client.write(new Buffer([2, 71, conPort, cpuPort, 03]));
		}
		
	}

	that.setKwmConnection = function (cpu) {

	}

	that.getAllValues = function () {
		if (client.destroyed) {
			manager.getIpAndPortForMatrix(that, function (ip, port) {
				client.connect(port, ip, function () {
					client.write(new Buffer([2, 83, 3]));
				});
			});
		} else {
			client.write(new Buffer([2, 83, 3]));
		}
	}

	that.delete = function () {
		manager.removeMatrix(that);
	}

	that.addCpuPort = function (cpuPort) {
		
	}

	that.addConPort = function (conPort) {
		
	}

	that.getCpuPort = function (id) {

	}

	that.getConPort = function (id) {

	}

	that.getCpuPorts = function () {

	}

	that.getConPorts = function () {

	}

	that.getAvaivableCpuPorts = function (token) {
		
	}

	that.getAvaivableConPorts = function (token) {

	}

	return that;
}