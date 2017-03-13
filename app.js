
var fs = require('fs');
var grpc = require('grpc');

var getServer = require("./getServer");

var server = getServer();

server.bind("0.0.0.0:5050", grpc.ServerCredentials.createInsecure());
server.start();

