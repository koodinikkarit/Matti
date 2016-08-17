module.exports = function(profile, matrix, manager) {
	var that = {};

	that.getPrograms = function(callback) {

	}

	that.getConPorts = function (callback) {

	}

	that.getCpuPorts = function(callback) {

	}

	that.makeVideoConnection = function (cpu, con) {
		manager.checkPermissionsForVideoConnection(profile, con, cpu, function (ok) {
			if (ok) {
				console.log(matrix);
				matrix.makeVideoConnection(cpu, con);
			}
		});
	}

	that.makeKwmConnection = function(con, cpu) {

	}

	that.getProfile = function () {
		return profile;
	}

	that.getMatrix = function() {
		return matrix;
	}

	return that;
}