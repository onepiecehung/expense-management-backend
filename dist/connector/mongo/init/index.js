"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const service_config_1 = require("../../../config/service.config");
const logger_mixed_1 = require("../../../core/log/logger.mixed");
mongoose_1.default.Promise = global.Promise;
mongoose_1.default
    .connect(service_config_1.MONGO.DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    logger_mixed_1.logger.debug(`[ Database =>] Connection to the database successful. ${service_config_1.MONGO.DB_URL} ✅`);
}, (err) => logger_mixed_1.logger.error(`[ Database =>] The connection to the database failed: ${err}. = ${service_config_1.MONGO.DB_URL} ❎`));
