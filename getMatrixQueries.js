
module.exports = function(db) {
	return {
		fetchMatrixs: function (call) {
			var parameters = call.request;
			//console.log("p", p, db.matrixs.toJS());
			db.matrixs.filter((p, i) => i >= parameters.offset && i < parameters.offset + parameters.limit).forEach(matrix => {
				call.write(matrix.toJS());
			});
			call.end();
		},
		fetchMatrixById: function (call, callback) {
			console.log("id", call.request.id);
			callback(null, db.matrixs.get(call.request.id).toJS());
		},
		fetchMatrixBySlug: function (call, callback) {
			callback(null, db.matrixs.find(p => p.slug === call.request.slug).toJS());
		},
		fetchConPortsByMatrixId: function (call) {
			db.conPorts.filter((p, i) => p.matrixId === call.request.matrixId).forEach(conPort => {
				call.write(conPort.toJS());
			});
			call.end();
		},
		fetchCpuPortsByMatrixId: function (call) {
			db.cpuPorts.filter((p, i) => p.matrixId === call.request.matrixId).forEach(cpuPort => {
				call.write(cpuPort.toJS());
			});
			call.end();
		}
	}
}
