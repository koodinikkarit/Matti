module.exports = function(id, manager) {
	var that = {};

	that.getId = function () {
		return id;
	}

	that.getToken = function (callback) {
		manager.getTokenForTokenId(id, function (token_str) {
			if (callback) callback(token_str);
		});
	}
	
	that.getChildren = function (callback) {
		manager.getTokenChildren(that, callback);
	}

	that.getParent = function (callback) {
		manager.getTokenParent(that);
	}

	that.createProfile = function (name, callback) {
		manager.createProfile(name, that, callback);
	}

	return that;
}