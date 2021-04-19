"use strict";
// #!/usr/bin/env node
/**
 * Module dependencies.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug")("ds112:server");
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("../app"));
const service_config_1 = require("../config/service.config");
// import SocketIO from "../connector/socket.io/init/index";
const logger_mixed_1 = require("../core/log/logger.mixed");
// const SERVER from "../config/constants");
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(service_config_1.SERVER.PORT);
app_1.default.set("port", port);
/**
 * Create HTTP server.
 */
const server = http_1.default.createServer(app_1.default);
/**
 * TODO: Setup socket.io
 */
// app.set("socketService", new SocketIO(server));
// export const socketService = app.get("socketService");
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => {
    logger_mixed_1.logger.warn(`Service APIs running on port: ${port}`);
    logger_mixed_1.logger.info(`
    ─────────────────────╔╗╔╗──────╔═╗╔═╗───────────╔╗
    ─────────────────────║║║║──────║║╚╝║║──────────╔╝╚╗
    ╔══╦══╦╗╔╗╔╦══╦═╦══╦═╝║║╚═╦╗─╔╗║╔╗╔╗╠══╦═╗╔══╦═╩╗╔╬══╦══╗
    ║╔╗║╔╗║╚╝╚╝║║═╣╔╣║═╣╔╗║║╔╗║║─║║║║║║║║╔╗║╔╗╣╔╗║╔╗║║║║═╣╔╗║
    ║╚╝║╚╝╠╗╔╗╔╣║═╣║║║═╣╚╝║║╚╝║╚═╝║║║║║║║╔╗║║║║╚╝║╔╗║╚╣║═╣╔╗║
    ║╔═╩══╝╚╝╚╝╚══╩╝╚══╩══╝╚══╩═╗╔╝╚╝╚╝╚╩╝╚╩╝╚╩═╗╠╝╚╩═╩══╩╝╚╝
    ║║────────────────────────╔═╝║────────────╔═╝║
    ╚╝────────────────────────╚══╝────────────╚══╝`);
});
server.on("error", onError);
server.on("listening", onListening);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    logger_mixed_1.logger.error(`⚠️ ⚠️ ⚠️  Bruh... port = ${port}? 📌📌📌 , some function will be missing!!!`);
    return Math.abs(port);
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
}
exports.default = server;
