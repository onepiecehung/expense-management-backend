"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rabbit_config_1 = require("../config/rabbit.config");
const index_1 = __importDefault(require("../connector/rabbitmq/init/index"));
// import * as UserSessionRepository from "../repository/user.session.repository";
const logger_mixed_1 = require("../core/log/logger.mixed");
index_1.default?.consumeData(rabbit_config_1.JOB_NAME.ACCESS_TOKEN_FROM_NEW_LOCATION, async (msg, channel) => {
    try {
        let message = JSON.parse(msg.content.toString());
        if (process.env.NODE_ENV === "development") {
            logger_mixed_1.logger.debug(message);
        }
        logger_mixed_1.logger.warn(`Sent email to {user} success [Not yet setup mail]`);
        channel.ack(msg);
        return true;
    }
    catch (error) {
        logger_mixed_1.logger.error(`Sent email to {user} fail`);
        logger_mixed_1.logger.error(error);
        channel.nack(msg);
        return false;
    }
});
