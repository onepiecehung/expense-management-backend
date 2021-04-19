"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../config/index");
const index_2 = __importDefault(require("../init/index"));
const logger_mixed_1 = require("../../../core/log/logger.mixed");
index_2.default?.consumeData(index_1.JOB_NAME.TEST_RABBIT, async (msg, channel) => {
    try {
        let message = JSON.parse(msg.content.toString());
        logger_mixed_1.logger.warn("[Receiver]", " RabbitMQ: " + message.msg);
        channel.ack(msg);
        return true;
    }
    catch (error) {
        console.error("TEST_AMQP error");
        console.error(error);
        channel.nack(msg);
        return true;
    }
});
