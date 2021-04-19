"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testAMQP = void 0;
const rabbit_config_1 = require("../../../config/rabbit.config");
const index_1 = __importDefault(require("../init/index"));
const logger_mixed_1 = require("../../../core/log/logger.mixed");
function testAMQP() {
    logger_mixed_1.logger.info(`[Sender]: Start sending the message to RabbitMQ...`);
    index_1.default.sendDataToRabbit(rabbit_config_1.JOB_NAME.TEST_RABBIT, {
        msg: `[Rabbit] Test AMQP success: ${new Date().toISOString()}`,
    });
    index_1.default.sendDataToRabbit(rabbit_config_1.JOB_NAME.GO_TEST_RABBIT, {
        msg: `[Rabbit to Go] Test AMQP success: ${new Date().toISOString()}`,
    });
}
exports.testAMQP = testAMQP;
