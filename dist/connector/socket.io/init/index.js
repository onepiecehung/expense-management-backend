"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const socket_io_1 = require("socket.io");
const socket_io_redis_1 = require("socket.io-redis");
const service_config_1 = require("../../../config/service.config");
const logger_mixed_1 = require("../../../core/log/logger.mixed");
const response_json_1 = require("../../../core/response/response.json");
const config_1 = require("../config");
class SocketIO {
    constructor() {
        this.names = { test: "test", user: "user" };
        // TODO: new server running port
        this.io = new socket_io_1.Server(parseInt(service_config_1.SERVER.WS_PORT), {
            path: "/ws",
        });
        // !important: if you use redis-cluster: https://github.com/socketio/socket.io-redis#with-ioredis-client
        // TODO: setup pub/sub
        this.pubClient = new redis_1.RedisClient({
            url: process.env.REDIS_URL_WS || "redis://127.0.0.1:6379/6",
        });
        this.subClient = this.pubClient.duplicate();
        // TODO: setup adapter
        this.io.adapter(socket_io_redis_1.createAdapter({
            pubClient: this.pubClient,
            subClient: this.subClient,
        }));
        // TODO: setup nsp
        this.namespace = this.getNamespace();
        // TODO: The errors emitted from pubClient and subClient will also be forwarded to the adapter instance:
        this.getNamespace().adapter.on("error", (error) => {
            console.log(error);
        });
        // TODO: setup middleware
        this.setMiddleware(async (socket, next) => {
            try {
                // await AuthenticationWebSocket(socket, next);
                next();
            }
            catch (error) {
                error = response_json_1.responseWSError({ message: error.message }, 403);
                socket.disconnect(true);
                next(new Error(JSON.stringify(error)));
            }
        });
        // TODO: setup socket
        this.socket = this.getSocket();
        setTimeout(() => {
            // console.log(this.getSocket().local);
            // console.log(this.socket.handshake?.user);
            this.emitEvent(config_1.EVENT.TEST, {
                ["Socket.IO"]: `Sender: sent successfully at ${new Date().toLocaleString()}`,
            });
        }, 5000);
        // server-side
        // this.io.of(this.names.user).on("connection", (socket: Socket) => {
        //     socket.on("hello", (arg: any) => {
        //         console.log(arg); // world
        //     });
        // });
        // setTimeout(() => {
        //     this.onListenEvent(EVENT.MESSAGE, (data: any) => {
        //         console.log(data);
        //     });
        // }, 1000);
        logger_mixed_1.logger.error(`Server socket.io on port ${service_config_1.SERVER.WS_PORT}`);
    }
    getPubClient() {
        return this.pubClient;
    }
    getSubClient() {
        return this.subClient;
    }
    subEvent(eventName) {
        this.subClient?.subscribe(eventName);
    }
    pubEvent(eventName, data) {
        this.pubClient?.publish(eventName, data);
    }
    setMiddleware(callback) {
        this.namespace.use((socket, next) => {
            callback(socket, next);
        });
    }
    // TODO: setup nsp
    //  this.namespace = this.io.of(this.names.user);
    getNamespace(namespace = this.names.user) {
        const nsp = this.namespace;
        if (nsp) {
            return this.namespace;
        }
        this.namespace = this.io.of(namespace);
        return this.namespace;
    }
    getSocket(listenName = "connection") {
        const ws = this.socket;
        if (ws) {
            return this.socket;
        }
        return this.getNamespace().on(listenName, (socket) => {
            this.socket = socket;
            return this.socket;
        });
    }
    onListenEvent(eventName, callback) {
        if (!this.socket) {
            this.socket = this.getSocket();
        }
        this.socket.on(eventName, (arg) => {
            callback(arg, callback);
        });
    }
    // sending to the client
    emitEvent(eventName, data) {
        try {
            this.getSocket()?.emit(eventName, data);
        }
        catch (error) {
            logger_mixed_1.logger.error(error);
            this.getSocket()?.emit(eventName, error);
        }
    }
    broadcastEmitEvent(eventName, data) {
        try {
            this.io.broadcast?.emit(eventName, data);
        }
        catch (error) {
            this.io.broadcast?.emit(eventName, error);
        }
    }
}
exports.default = new SocketIO();
