"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationWebSocket = exports.AuthorizationRefreshToken = exports.Authentication = exports.getToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_config_1 = require("../../config/jwt.config");
const Redis = __importStar(require("../../connector/redis/index"));
const logger_mixed_1 = require("../../core/log/logger.mixed");
const response_json_1 = require("../../core/response/response.json");
const jwt_error_message_1 = require("../../messages/errors/jwt.error.message");
const UserRepository = __importStar(require("../../repository/user.repository"));
function getToken(headers) {
    try {
        if ((headers && headers.authorization) || headers["x-access-token"]) {
            let token = headers.authorization || headers["x-access-token"];
            if (token.startsWith(`TEA `)) {
                token = token.slice(4, token.length);
                return token;
            }
            else {
                return token;
            }
        }
        return null;
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return null;
    }
}
exports.getToken = getToken;
async function Authentication(req, res, next) {
    try {
        const token = getToken(req.headers);
        if (token) {
            const JWT = jsonwebtoken_1.default.verify(token, jwt_config_1.PRIVATE_KEY_ACCESS);
            const accessTokenKey = `AccessToken_UserId_${JWT?._id}_uuid_${JWT?.uuid}`;
            const accessTokenValue = await Redis.getJson(accessTokenKey);
            if (!accessTokenValue) {
                throw new Error(jwt_error_message_1.AUTH.TOKEN_EXPIRED_OR_IS_UNAVAILABLE);
            }
            const myKey = `UserInfo_${JWT?._id}`;
            let user = await Redis.getJson(myKey);
            if (!user) {
                user = await UserRepository.findById(JWT?._id);
                await Redis.setJson(myKey, user?.toJSON(), 90);
            }
            else
                delete user?.password;
            if (user) {
                Object.assign(res.locals, { user: user }, { token: JWT });
            }
            else {
                throw new Error(jwt_error_message_1.AUTH.TOKEN_EXPIRED_OR_IS_UNAVAILABLE);
            }
            return next();
        }
        return response_json_1.responseError(req, res, jwt_error_message_1.AUTH.TOKEN_EXPIRED_OR_IS_UNAVAILABLE, 401);
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error, 401);
    }
}
exports.Authentication = Authentication;
async function AuthorizationRefreshToken(req, res, next) {
    try {
        const token = getToken(req.headers);
        if (token) {
            const JWT = jsonwebtoken_1.default.verify(token, jwt_config_1.PRIVATE_KEY_REFRESH);
            if (JWT) {
                Object.assign(res.locals, { user: JWT });
            }
            else {
                throw new Error(jwt_error_message_1.AUTH.TOKEN_EXPIRED_OR_IS_UNAVAILABLE);
            }
            return next();
        }
        return response_json_1.responseError(req, res, jwt_error_message_1.AUTH.TOKEN_EXPIRED_OR_IS_UNAVAILABLE, 401);
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error, 401);
    }
}
exports.AuthorizationRefreshToken = AuthorizationRefreshToken;
async function AuthenticationWebSocket(socket, next) {
    try {
        const token = socket.handshake.auth.token;
        if (token) {
            const JWT = jsonwebtoken_1.default.verify(token, jwt_config_1.PRIVATE_KEY_ACCESS);
            const accessTokenKey = `AccessToken_UserId_${JWT?._id}_uuid_${JWT?.uuid}`;
            const accessTokenValue = await Redis.getJson(accessTokenKey);
            if (!accessTokenValue) {
                throw new Error(jwt_error_message_1.AUTH.TOKEN_EXPIRED_OR_IS_UNAVAILABLE);
            }
            const myKey = `UserInfo_${JWT?._id}`;
            const userRedis = await Redis.getJson(myKey);
            if (!userRedis) {
                const user = await UserRepository.findById(JWT._id);
                if (!user) {
                    throw new Error(jwt_error_message_1.AUTH.TOKEN_EXPIRED_OR_IS_UNAVAILABLE);
                }
                await Redis.setJson(myKey, user?.toJSON(), 90);
                Object.assign(socket.handshake, { user: user }, { token: JWT });
            }
            else
                Object.assign(socket.handshake, { user: userRedis }, { token: JWT });
            // console.log(socket.handshake?.user, socket.handshake?.token);
            return next();
        }
        throw new Error(jwt_error_message_1.AUTH.TOKEN_EXPIRED_OR_IS_UNAVAILABLE);
    }
    catch (error) {
        throw new Error(error);
    }
}
exports.AuthenticationWebSocket = AuthenticationWebSocket;
