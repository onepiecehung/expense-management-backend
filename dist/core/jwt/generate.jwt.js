"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const jwt_config_1 = require("../../config/jwt.config");
const jwt_error_message_1 = require("../../messages/errors/jwt.error.message");
const logger_mixed_1 = require("../log/logger.mixed");
/**
 *
 * @param payload
 * @param expiresIn
 */
async function generateAccessToken(payload, expiresIn = "1h") {
    try {
        return jsonwebtoken_1.sign(payload, jwt_config_1.PRIVATE_KEY_ACCESS, {
            expiresIn: expiresIn,
            algorithm: "HS512",
        });
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        throw new Error(jwt_error_message_1.JWT_MESSAGE.JWT_GENERATE_ERROR);
    }
}
exports.generateAccessToken = generateAccessToken;
/**
 *
 * @param payload
 * @param expiresIn
 */
async function generateRefreshToken(payload, expiresIn = "365d") {
    try {
        return jsonwebtoken_1.sign(payload, jwt_config_1.PRIVATE_KEY_REFRESH, {
            expiresIn: expiresIn,
            algorithm: "HS384",
        });
    }
    catch (error) {
        throw new Error(jwt_error_message_1.JWT_MESSAGE.JWT_GENERATE_ERROR);
    }
}
exports.generateRefreshToken = generateRefreshToken;
