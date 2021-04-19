"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const service_config_1 = require("../../../config/service.config");
const logger_mixed_1 = require("../../../core/log/logger.mixed");
const index_1 = require("../config/index");
// const socket = io(`http://localhost:${SERVER.PORT}`);
class SocketIOClient {
    // socket: typeof io;
    constructor() {
        setTimeout(() => {
            this.login(process.env.TEST_USER, process.env.TEST_PASS).then((response) => {
                this.user = response.data;
                console.log(this.user);
            });
        }, 1000);
        console.log(this.user);
    }
    async login(id, pass) {
        try {
            const user = await axios_1.default({
                method: "POST",
                url: `http://localhost:${service_config_1.SERVER.PORT}/rest/v1/users/login`,
                data: {
                    id: id,
                    password: pass,
                },
            });
            return user.data;
        }
        catch (error) {
            return error.message;
        }
    }
}
const socket = socket_io_client_1.default(`ws://localhost:${service_config_1.SERVER.WS_PORT}/user`, {
    path: "/ws/ws",
    auth: {
        token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDUyYmFkZGU4YWEyOTBjMDg1YmYyMGQiLCJpcCI6IjE0LjI0MS4yMjUuMSIsInV1aWQiOiI4OGIzODUwZC0xMTI3LTQ4ZTEtYmU5ZC0zNmEyZTRiOThjNWIiLCJpYXQiOjE2MTYwMzQ1MzUsImV4cCI6MTYxNjAzODEzNX0.9Ha8MTZfPJJVELXNPrKqviF6KoOXQiZsYbFw5RPt5l3OYRL259WvZzyVl3zrEPqkFjHY4j5bfljv_InLg0AyRA",
    },
    // reconnectionDelay: 1000,
    // reconnection: true,
    // reconnectionAttempts: 10,
    // transports: ["websocket"],
    // agent: false, // [2] Please don't set this to true
    // upgrade: false,
    // rejectUnauthorized: false,
});
socket.on("connect", () => {
    console.log(socket.connected);
});
socket.on(index_1.EVENT.TEST, (data, callback) => {
    logger_mixed_1.logger.warn(`[Receiver-Socket.io]: ${data["Socket.IO"]}`);
    // callback({
    //     status: "ok",
    // });
});
socket.on(index_1.EVENT.INIT, (data) => {
    logger_mixed_1.logger.warn(`[Receiver-Socket.io]: ${data.data}`);
});
socket.on("disconnect", () => {
    console.log(socket.connected);
    logger_mixed_1.logger.info(`Disconnecting socket...`);
});
setInterval(() => {
    socket.emit("hello", "Hi,Hello", (response) => {
        console.log(response.date);
    });
    // socket.emit(EVENT.MESSAGE, "Hi");
}, 2000);
// client - side;
socket.on("connect_error", (error) => {
    // if (JSON.parse(error.message)) {
    //     logger.error(JSON.parse(error.message)); // prints the message associated with the error
    // }
    logger_mixed_1.logger.error(error.message);
});
// export default new SocketIOClient();
