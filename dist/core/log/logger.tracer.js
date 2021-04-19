"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tracer_1 = __importDefault(require("tracer"));
const logger = tracer_1.default.colorConsole();
/**
 * Log data
 * @param text message
 * @param shop shop domain
 */
const log = (text, type = 'log') => {
    logger[type](text);
};
exports.default = log;
