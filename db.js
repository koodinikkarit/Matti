
var fs = require("fs");
var Map = require("immutable").Map;

module.exports = function (options) {
	var that = this;
	var db = new Map();
	var nextIds = new Map();
	var saveScheduled = false;

	options.entityTypes.forEach(function (entityType) {
		db = db.set(entityType.tableName, new Map());
		nextIds = nextIds.set(entityType.tableName, 1);
		function set(table) {
			setDb(db.set(entityType.tableName, table));
		}

		Object.defineProperty(that, entityType.tableName, {
			get: function() {
				var table = db.get(entityType.tableName); 
				table.push = (o) => {
					var newId = nextIds.get(entityType.tableName);
					var newO = o.set("id", newId);
					nextIds = nextIds.set(entityType.tableName, nextIds.get(entityType.tableName) + 1);					
					set(table.set(parseInt(newId), newO));
					return newO;
				}
				table.remove = (id) => {
					set(table.delete(id));
				}
				return table;
			},
			set
		})
	});

	fs.readFile(options.databasePath, "utf8", function (err, data) {
		console.log("err", err);
		if (!err && data !== "undefined") {
			var loadedDatabase = JSON.parse(data);
			db = db.withMutations(db => {
				options.entityTypes.forEach(function (entityType) {
					var table = loadedDatabase[entityType.tableName];
					if (table) {
						db.set(entityType.tableName, db.get(entityType.tableName).withMutations(dbTable => {
							Object.keys(table).forEach(id => {
								var entity = table[id];
								if (entity) {
									dbTable.set(parseInt(id), new entityType.type(entity));
								}
							});
						}));
					}
				});
			});
		}
	});

	function setDb (newDatabase) {
		if (newDatabase !== db) {
			db = newDatabase;
			if (!saveScheduled) {
				setTimeout(function() {
					fs.writeFile(options.databasePath, JSON.stringify(db), function(err) {
						if (!err) {
							saveScheduled = false;
							console.log("Saved database to file", options.databasePath);
						}
					});
				}, options.saveInterval);
				saveScheduled = true;
			}
		}
	}
}