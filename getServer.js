
var grpc = require('grpc');

var mattiService = grpc.load("./matti_service/matti_service.proto").MattiService;

var Db = require("./db");

var getMatrixQueries = require("./getMatrixQueries");
var getMatrixMutations = require("./getMatrixMutations");

var Matrix = require("./records/Matrix");
var ConPort = require("./records/ConPort");
var CpuPort = require("./records/CpuPort");

module.exports = function () {
	var server = new grpc.Server();

	var db = new Db({
		databasePath: "./database.json",
		saveInterval: 2000,
		entityTypes: [
			{
				type: Matrix,
				tableName: "matrixs",
				idName: "matrixId"
			},
			{
				type: ConPort,
				tableName: "conPorts",
				idName: "conPortId"
			},
			{
				type: CpuPort,
				tableName: "cpuPorts",
				idName: "cpuPortId"
			}
		]
	});

	server.addProtoService(mattiService.Matti.service, Object.assign(
		getMatrixQueries(db),
		getMatrixMutations(db)
	));

	return server;
}