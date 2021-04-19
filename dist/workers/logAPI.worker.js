"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const geoip_lite_1 = require("geoip-lite");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_config_1 = require("../config/jwt.config");
const rabbit_config_1 = require("../config/rabbit.config");
const init_1 = __importDefault(require("../connector/rabbitmq/init"));
const LogAPIRepository = __importStar(require("../repository/logAPI.repository"));
const logger_mixed_1 = require("../core/log/logger.mixed");
init_1.default?.consumeData(rabbit_config_1.JOB_NAME.LOG_ACTION, async (msg, channel) => {
    try {
        const message = JSON.parse(msg.content.toString());
        delete message?.body?.password;
        let level = 0;
        switch (message.method) {
            case "PATCH":
            case "PUT":
                level = 1;
                break;
            case "POST":
            case "DELETE":
                level = 2;
                break;
            default:
                break;
        }
        // if (process.env.NODE_ENV === "development") {
        // logger.debug(message);
        // }
        if (message.token) {
            message.token = jsonwebtoken_1.default.verify(message.token, jwt_config_1.PRIVATE_KEY_ACCESS);
        }
        else
            delete message.token;
        const location = geoip_lite_1.lookup(message.ip);
        const payload = Object.assign(message, {
            location: location,
            level: level,
        });
        await LogAPIRepository.findOneAndUpdate(payload);
        // logger.warn(`Write log API success`);
        channel.ack(msg);
        return true;
    }
    catch (error) {
        logger_mixed_1.logger.error(`Write log API without token`);
        // logger.error(error);
        const message = JSON.parse(msg.content.toString());
        delete message?.body?.password;
        let level = 0;
        switch (message.method) {
            case "PATCH":
            case "PUT":
                level = 1;
                break;
            case "POST":
            case "DELETE":
                level = 2;
                break;
            default:
                break;
        }
        // if (process.env.NODE_ENV === "development") {
        // logger.debug(message);
        // }
        delete message.token;
        const location = geoip_lite_1.lookup(message.ip);
        const payload = Object.assign(message, {
            location: location,
            level: level,
        });
        await LogAPIRepository.findOneAndUpdate(payload);
        // logger.warn(`Write log API success`);
        channel.ack(msg);
        return true;
    }
});
