
var net = require('net');
var mysql = require('mysql');
var Matrix = require('./Matrix');
var ConPort = require('./ConPort');
var CpuPort = require('./CpuPort');
var Profile = require('./profile');
var Token = require('./token');

module.exports = function(sqlAddress, database, user) {
	var that = {};

	var connection = mysql.createConnection({
		host: sqlAddress,
		user: user,
		database: database
	});

	that.createMatrix = function (ip, port, conPorts, cpuPorts, callback) {
		connection.query({
			sql: 'insert into matrix(ip, port) values(?, ?)',
			values: [ip, port]
		}, function (error, results, fields) {
			if (!error) {
				var matrix = new Matrix(results.insertId, that);
				for (var i = 0; i < conPorts; i++) {
					that.createConPort(matrix, i+1);
				}
				for (var i = 0; i < cpuPorts; i++) {
					that.createCpuPort(matrix, i+1);
				}
				if (callback) callback(matrix);
			}
		});
	}

	that.getIpAndPortForMatrix = function (matrix, callback) {
		console.log(matrix);
		connection.query({
			sql: 'select ip, port from matrix where id = ?',
			values: [matrix.getId()]
		}, function (error, results, fields) {
			if (!error) {
				if (results.length > 0) {
					callback(results[0].ip, results[0].port);
				}
			}
		});
	}

	that.createConPort = function (matrix, n, callback) {
		connection.query({
			sql: 'select COUNT(id) as A from con_ports where matri_id = ? and port_number = ?',
			values: [matrix.getId(), n]
		}, function (error, results, fields) {
			if (!error) {
				if (results[0].A === 0) {
					connection.query({
						sql: 'insert into con_ports(matrix_id, port_number) values(?, ?)',
						values: [matrix.getId(), n]
					}, function (error, results, fields) {
						if (!error) {
						var conPort = ConPort(results.insertId, that);
							if (callback) callback(conPort);
						}
					});
				}
			}
		})

	}

	that.createCpuPort = function (matrix, n, callback) {
		connection.query({
			sql: 'select COUNT(id) as A from cpu_ports where matri_id = ? and port_number = ?',
			values: [matrix.getId(), n]
		}, function (error, results, fields) {
			if (!error) {
				if (results[0].A === 0) {
					connection.query({
						sql: 'insert into cpu_ports(matrix_id, port_number) values(?, ?)',
						values: [matrix.getId(), n]
					}, function (error, results, fields) {
						if (!error) {
							var cpuPort = CpuPort(results.insertId, that);
							if (callback) callback(cpuPort);
						}
					});
				}
			}
		});
	}

	that.getMatrixs = function () {

	}

	that.setNameForCpuPort = function (profile, cpuPort) {

	}

	that.setNameForConPort = function(profile, conPort) {

	}

	that.createVideoConnection = function (cpu, con, program) {

	}

	that.createKwmConnection = function (cpu, con, program) {

	}

	that.createProfile = function(name, token, callback) {
		connection.query( {
			sql: 'select id from profile where name = ? and token = ?',
			values: [name, token.getId()]
		}, function (error, results, fields) {
			console.log(error);
 			if (!error) {
				 if (results.length == 0) {
					connection.query({
						sql: 'insert into profile(name, token) values(?, ?)',
						values: [name, token.getId()]
					}, function (error, results, fields) {
						console.log(error);
						if (!error) {
							var profile = new Profile(results.insertId, that);
							if (callback) callback(profile);
						}
					});
				 } else {
					 var profile = Profile(results[0].id, that);
					 if (callback) callback(profile);
				 }
			 }
		});

	}

	that.createToken = function (token_str, callback) {
		connection.query({
			sql: 'select id from token where token_str = ?',
			values: [token_str]		
		}, function (error, results, fields) {
			console.log(error);
			if (!error) {
				if (results.length === 0) {
					connection.query( {
						sql: 'insert into token(token_str) values(?)',
						values: [token_str]
					}, function (error, results, fields) {
						if (!error) {
							if (callback) callback(new Token(results.insertId, that));
						}
					});
				} else {
					if (callback) callback(new Token(results[0].id, that));
				}
			}
		});
	}

	that.getProfilesForToken = function (token, callback) {
		connection.query({
			sql: 'select id from profile where token = ?',
			values: [token]
		}, function (error, results, fields) {
			if (!error) {
				var profiles = [];
				results.forEach(function(element) {
					profiles.push(new Profile(element, that));
				}, this);
				if (callback) callback(profiles);
			}
		});
	}

	that.getTokenForTokenId = function (tokenId, callback) {
		connection.query({
			sql:'select token_str from token whre id = tokenId',
			values: [tokenId]
		}, function (error, results, fields) {
			if (!error) {
				if (results.length > 0) {
					if (callback) callback(results[0].token_str);
				}
			}
		});
	}

	that.removeMatrix = function (matrix, callback) {
		connection.beginTransaction(function (err) {
			connection.query({
				sql: 'delete from con_ports where matrix_id = ?',
				values: [matrix.getId()]
			}, function (error, results, fields) {
				if (!error) {
				}
			});

			connection.query({
				sql: 'delete from cpu_ports where matrix_id = ?',
				values: [matrix.getId()]
			}, function (error, results, fields) {

			});

			connection.commit(function(err) {
				if (!err) {
					connection.query({
						sql: 'delete from matrix where id = ?',
						values: [matrix.getId()]
					}, function (error, results, fields) {
						if (!error) {
							if (callback) callback();
						}
					});
				} else {
					connection.rollback(function() {

					});
				}
			});
		});
	}

	that.getTokenChildren = function (token, callback) {
		connection.query({
			sql: 'select id from token_inheritance where token = ?',
			values: [token.getId()]
		}, function (error, results, fields) {
			if (!error) {
				var tokens = [];
				results.forEach(function(element) {
					tokens = new Token(element, that);
				}, this);
				if (callback) callback(tokens);
			}
		});
	}

	that.getTokenParent = function (token, callback) {
		connection.query( {
			sql: 'select id from token_inheritance where child = ?',
			values: [token.getId()]
		}, function (error, results, fields) {
			if (!error) {
				if (results.length > 0) {
					var token = new Token(results[0].id, that);
					if (callback) callback(token);
				}
			}
		});
	}

	that.addPortToMatrix = function (port) {

	}

	that.getMatrixDevices = function () {

	}

	return that;
}