
var Matrix = require("./records/Matrix");
var ConPort = require("./records/ConPort");
var CpuPort = require("./records/CpuPort");

module.exports = function (db) {
	return {
		connectMatrix: function (call, callback) {
			var res = {};
			if (!db.matrixs.some(p => p.slug === call.request.slug)) {
				console.log("request", call.request);
				var matrix = db.matrixs.push(new Matrix(call.request));
				res.matrix = matrix.toJS();
				res.success = true;
				res.state = "CREATED";

				for (var i = 0; i < call.request.numberOfConPorts; i++) {
					db.conPorts.push(new ConPort({
						portNum: i+1,
						matrixId: matrix.id
					}));
				}
				for (var i = 0; i < call.request.numberOfCpuPorts; i++) {
					db.cpuPorts.push(new CpuPort({
						portNum: i+1,
						matrixId: matrix.id
					}));
				}
			} else {
				res.success = false;
				res.state = "SLUG_ALLREDY_FOUND";
			}
			callback(null, res);
		},
		editMatrix: function(call, callback) {
			var res = {};
			var matrix = db.matrixs.get(call.request.id);
			if (matrix) {
				console.log("muokkattava matriisi loytyi", matrix, call.request);
				db.matrixs = db.matrixs.withMutations(matrixs => {
					matrixs.set(call.request.id, matrix.withMutations(matrix => {
						if (call.request.slug && !db.matrixs.some(p => p.slug === call.request.slug)) matrix.slug = call.request.slug;
						if (call.request.ip) matrix.ip = call.request.ip;
						if (call.request.port) matrix.port = call.request.port; 
						console.log("muokattu matriisi", matrix);
						res.matrix = matrix.toJS();
					}));
					console.log("matrixs", matrixs.toJS());
				});
				console.log("matrixs", db.matrixs.toJS());
				res.success = true;
				res.state = "MATRIX_EDITED";
			} else {
				res.success = false;
				res.state = "MATRIX_NOT_FOUND";
			}
			callback(null, res);
		},
		removeMatrix: function (call, callback) {
			var res = {};
			if (db.matrixs.has(call.request.id)) {
				res.success = true;
				res.state = "MATRIX_REMOVED";
				db.matrixs.remove(call.request.id);
				db.conPorts = db.conPorts.filterNot(p => p.matrixId === call.request.id);
				db.cpuPorts = db.cpuPorts.filterNot(p => p.matrixId === call.request.id);
			} else {
				res.success = false;
				res.state = "MATRIX_NOT_FOUND";
			}
			callback(null, res);
		},
		editConPort: function (call, callback) {
			var res = {};
			var conPort = db.conPorts.get(call.request.id);
			if (conPort) {
				db.conPorts = db.conPorts.withMutations(conPorts => {
					conPorts.set(call.request.id, conPort.withMutations(conPort => {
						if (call.request.slug && !db.conPorts.some(p => p.matrixId === conPort.matrixId && p.slug === call.request.id)) conPort.slug = call.request.slug;
						res.success = true;
						res.state = "CON_PORT_EDITED";
						res.conPort = conPort.toJS();	
					}));
				});
			} else {
				res.success = false;
				res.state = "CON_PORT_NOT_FOUND";
			}
			callback(null, res);
		},
		editCpuPort: function (call, callback) {
			var res = {};
			var cpuPort = db.cpuPorts.get(call.request.id);
			if (cpuPort) {
				db.cpuPorts = db.cpuPorts.withMutations(cpuPorts => {
					cpuPorts.set(call.request.id, cpuPort.withMutations(cpuPort => {
						if (call.request.slug && !db.cpuPorts.some(p => p.matrixId === cpuPort.matrixId && p.slug === call.request.id)) cpuPort.slug = call.request.slug;
						res.success = true;
						res.state = "CPU_PORT_EDITED";
						res.cpuPort = cpuPort.toJS();	
					}));
				});
			} else {
				res.success = false;
				res.state = "CPU_PORT_NOT_FOUND";
			}
			callback(null, res);
		}
	}
}
