"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
const rabbit_config_1 = require("../../config/rabbit.config");
const index_1 = __importDefault(require("../../connector/rabbitmq/init/index"));
const logger_mixed_1 = require("../../core/log/logger.mixed");
const auth_jwt_middleware_1 = require("../jwt/auth.jwt.middleware");
async function log(req, res, next) {
    try {
        const start = process.hrtime();
        const userAgent = new ua_parser_js_1.default(req.headers["user-agent"]).getResult();
        const ip = res.locals?.ip;
        const token = auth_jwt_middleware_1.getToken(req.headers);
        const payload = {
            method: req.method,
            httpVersion: req.httpVersion,
            hostname: req.hostname,
            originalUrl: req.originalUrl,
            protocol: req.protocol,
            ip: ip,
            token: token,
            userAgent: userAgent,
            body: req.body,
            query: req.query,
        };
        const getDurationInMilliseconds = (start) => {
            const NS_PER_SEC = 1e9;
            const NS_TO_MS = 1e6;
            const diff = process.hrtime(start);
            return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
        };
        res.on("finish", () => {
            Object.assign(payload, {
                finishedTimeMs: getDurationInMilliseconds(start),
                isFinishedTime: true,
                uuid: res.locals.uuid,
            });
            index_1.default.sendDataToRabbit(rabbit_config_1.JOB_NAME.LOG_ACTION, payload);
        });
        res.on("close", () => {
            Object.assign(payload, {
                closingTimeMs: getDurationInMilliseconds(start),
                isClosingTime: true,
                uuid: res.locals.uuid,
            });
            index_1.default.sendDataToRabbit(rabbit_config_1.JOB_NAME.LOG_ACTION, payload);
        });
        next();
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        next();
    }
}
exports.log = log;
