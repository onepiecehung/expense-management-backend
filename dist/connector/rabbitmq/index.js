"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkers = exports.createQueue = void 0;
const rabbit_config_1 = require("../../config/rabbit.config");
const logger_mixed_1 = require("../../core/log/logger.mixed");
const index_1 = __importDefault(require("./init/index"));
async function createQueue() {
    try {
        await index_1.default.initChannel();
        index_1.default.initQueue(rabbit_config_1.JOB_NAME.TEST_RABBIT, true);
        // RABBIT.initQueue(JOB_NAME.GO_TEST_RABBIT, true);
        index_1.default.initQueue(rabbit_config_1.JOB_NAME.USER_SESSION_WRITE, true);
        index_1.default.initQueue(rabbit_config_1.JOB_NAME.ACCESS_TOKEN_FROM_NEW_LOCATION, false);
        index_1.default.initQueue(rabbit_config_1.JOB_NAME.LOG_ACTION, false);
        // TODO: This for subscription
        // RABBIT.initExchange(SUB_NAME.S_TEST_RABBIT, true);
        logger_mixed_1.logger.log("⌛ ⌛ ⌛ AMQP queue is running...");
    }
    catch (error) {
        logger_mixed_1.logger.error("AMQP: createQueue initChannel error:");
        logger_mixed_1.logger.error(error);
    }
}
exports.createQueue = createQueue;
function createWorkers() {
    index_1.default.initChannel()
        .then(() => {
        require("./channel.rabbit");
        logger_mixed_1.logger.debug("⚔️  AMQP worker is running...");
    })
        .catch((error) => {
        logger_mixed_1.logger.error("AMQP: createWorkers initChannel error:");
        logger_mixed_1.logger.error(error);
    });
}
exports.createWorkers = createWorkers;
