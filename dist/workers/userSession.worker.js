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
const rabbit_config_1 = require("../config/rabbit.config");
const index_1 = __importDefault(require("../connector/rabbitmq/init/index"));
const UserSessionRepository = __importStar(require("../repository/userSession.repository"));
const logger_mixed_1 = require("../core/log/logger.mixed");
const geoip_lite_1 = require("geoip-lite");
index_1.default?.consumeData(rabbit_config_1.JOB_NAME.USER_SESSION_WRITE, async (msg, channel) => {
    try {
        const message = JSON.parse(msg.content.toString());
        let userSession = { ...message };
        userSession = Object.assign(userSession, {
            location: geoip_lite_1.lookup(userSession.ip),
        });
        await UserSessionRepository.create(userSession);
        logger_mixed_1.logger.warn(`Write user session success`);
        channel.ack(msg);
        return true;
    }
    catch (error) {
        logger_mixed_1.logger.error(`Write session failed`);
        logger_mixed_1.logger.error(error);
        channel.nack(msg);
        return false;
    }
});
