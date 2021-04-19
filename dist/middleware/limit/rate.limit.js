"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
const index_1 = require("../../connector/redis/index");
exports.apiLimiter = express_rate_limit_1.default({
    store: new rate_limit_redis_1.default({
        client: index_1.init(),
    }),
    windowMs: 1 * 60 * 1000,
    max: 100,
    handler: async (req, res) => {
        const DataResponse = {
            success: false,
            statusCode: 429,
            statusMessage: `failure`,
            statusCodeResponse: 50000,
            data: {
                errorMessage: `Your IP: ${res.locals?.ip} has been blocked, cause you sent too many requests, please try again after in a minute`,
                request: req?.url,
                method: req?.method,
            },
        };
        res.status(DataResponse.statusCode).json(DataResponse);
    },
});
