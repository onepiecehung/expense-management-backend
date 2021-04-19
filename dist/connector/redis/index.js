"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flushdb = exports.deleteKey = exports.getJson = exports.setJson = exports.init = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const service_config_1 = require("../../config/service.config");
const logger_mixed_1 = require("../../core/log/logger.mixed");
let client;
const timeEX = 120;
function init() {
    if (!client) {
        // default connect redis localhost:3306
        client = new ioredis_1.default(service_config_1.REDIS.REDIS_URL);
        client.on("error", (err) => {
            logger_mixed_1.logger.error(`Connect to Redis fail, you need install redis or start service redis`);
            logger_mixed_1.logger.error(err);
        });
        client.on("connect", () => {
            logger_mixed_1.logger.log(`Connect to Redis success: ${client.options.host}:${client.options.port}`);
        });
        client.on("ready", () => {
            logger_mixed_1.logger.log(`========== STATUS REDIS SERVER ==========`);
            logger_mixed_1.logger.log("Redis version: " + client.serverInfo.redis_version);
            logger_mixed_1.logger.log("OS running: " + client.serverInfo.os);
            logger_mixed_1.logger.log("Uptime: " + client.serverInfo.uptime_in_seconds + "s");
            logger_mixed_1.logger.info("Time check: " + `${new Date().toLocaleString()}`);
            logger_mixed_1.logger.log(`================== END ==================`);
        });
        // TODO: Deletes all keys from the connection's current database
        // client.flushdb();
        return client;
    }
    else {
        logger_mixed_1.logger.warn(`Connect to Redis success`);
        return client;
    }
}
exports.init = init;
client = init();
/**
 *
 * @param key
 * @param value
 * @param {Second} time
 */
async function setJson(key, value, time) {
    if (!time) {
        time = timeEX;
    }
    value = JSON.stringify(value);
    return client.set(key, value, "EX", time);
}
exports.setJson = setJson;
async function getJson(key) {
    let data = await client.get(key);
    if (data)
        data = JSON.parse(data);
    return data;
}
exports.getJson = getJson;
async function deleteKey(key) {
    return await client.del(key);
}
exports.deleteKey = deleteKey;
async function flushdb() {
    return await client.flushdb();
}
exports.flushdb = flushdb;
