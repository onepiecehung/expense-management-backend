"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RABBIT_URL = exports.JOB_NAME = void 0;
exports.JOB_NAME = {
    TEST_RABBIT: "TEST_RABBIT",
};
/**
 * @param RABBIT
 * @param RABBIT.URL
 */
exports.RABBIT_URL = process.env.RABBIT_URL || `amqp://guest:guest@localhost:5672`;
