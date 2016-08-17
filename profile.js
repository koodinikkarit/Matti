var MatrixProfile = require("./MatrixProfile");

module.exports = function(id, manager) {
	var that = {};

	that.getId = function() {
		return id;
	}

	that.getToken = function (callback) {

	}

	that.getMatrixs = function (callback) {
		var matrixProfiles = [];
		manager.getMatrixsForProfile(that, function (matrixs) {
			matrixs.forEach(function(matrix) {
				console.log(matrix);
				matrixProfiles.push(new MatrixProfile(that, matrix, manager));
			});	
			if (callback) callback(matrixProfiles);		
		});		
	}

	
	return that;
}