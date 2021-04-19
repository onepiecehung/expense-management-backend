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
exports.changePassword = exports.logout = exports.getAccessToken = exports.register = exports.login = void 0;
const bcrypt_1 = require("bcrypt");
const geoip_lite_1 = require("geoip-lite");
const rabbit_config_1 = require("../config/rabbit.config");
const index_1 = __importDefault(require("../connector/rabbitmq/init/index"));
const Redis = __importStar(require("../connector/redis/index"));
const user_error_message_1 = require("../messages/errors/user.error.message");
const user_success_message_1 = require("../messages/success/user.success.message");
const UserRepository = __importStar(require("../repository/user.repository"));
const UserSessionRepository = __importStar(require("../repository/userSession.repository"));
const generate_jwt_1 = require("../core/jwt/generate.jwt");
const logger_mixed_1 = require("../core/log/logger.mixed");
/**
 *
 * @param {Object} userInfo
 */
async function login(userInfo, locals) {
    try {
        const uuid = locals?.uuid;
        const userAgent = locals?.userAgent;
        const ip = locals?.ip;
        const userData = await UserRepository.findOne({
            $or: [
                {
                    username: userInfo.id,
                },
                {
                    email: userInfo.id,
                },
            ],
        });
        if (!userData) {
            return Promise.reject({
                message: user_error_message_1.USER_ERROR_MESSAGE.USERNAME_NOT_FOUND,
                statusCode: 410,
                statusCodeResponse: user_error_message_1.USER_ERROR_CODE.USERNAME_NOT_FOUND,
            });
        }
        if (userData?.status !== "active") {
            return Promise.reject({
                message: user_error_message_1.USER_ERROR_MESSAGE.USER_HAS_BEED_ + userData?.status,
                statusCode: 410,
                statusCodeResponse: user_error_message_1.USER_ERROR_CODE.USER_HAS_BEED_,
            });
        }
        const passwordCorrect = await bcrypt_1.compareSync(userInfo?.password, userData?.password);
        if (!passwordCorrect) {
            return Promise.reject({
                message: user_error_message_1.USER_ERROR_MESSAGE.PASSWORD_INCORRECT,
                statusCode: 410,
                statusCodeResponse: user_error_message_1.USER_ERROR_CODE.PASSWORD_INCORRECT,
            });
        }
        const accessToken = await generate_jwt_1.generateAccessToken({
            _id: userData?._id,
            ip: ip,
            uuid: uuid,
        });
        const tokenRedisKey = `AccessToken_UserId_${userData?._id}_uuid_${uuid}`;
        await Redis.setJson(tokenRedisKey, accessToken, 60 * 60);
        const refreshToken = await generate_jwt_1.generateRefreshToken({
            _id: userData?._id,
            ip: ip,
            uuid: uuid,
        });
        await index_1.default.sendDataToRabbit(rabbit_config_1.JOB_NAME.USER_SESSION_WRITE, {
            user: userData?._id,
            userAgent: userAgent?.getResult(),
            ip: ip,
            uuid: uuid,
        });
        return Promise.resolve({
            user: userData?.toJSON(),
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return Promise.reject(error);
    }
}
exports.login = login;
/**
 *
 * @param {Object} userInfo
 */
async function register(userInfo) {
    try {
        const checkEmail = await UserRepository.findByEmail(userInfo?.email);
        if (checkEmail) {
            return Promise.reject({
                message: user_error_message_1.USER_ERROR_MESSAGE.EMAIL_EXIST,
                statusCode: 410,
                statusCodeResponse: user_error_message_1.USER_ERROR_CODE.EMAIL_EXIST,
            });
        }
        const checkUsername = await UserRepository.findOne({
            username: userInfo?.username?.toLowerCase(),
        });
        if (checkUsername) {
            return Promise.reject({
                message: user_error_message_1.USER_ERROR_MESSAGE.USERNAME_EXIST,
                statusCode: 410,
                statusCodeResponse: user_error_message_1.USER_ERROR_CODE.USERNAME_EXIST,
            });
        }
        const data = await UserRepository.create(userInfo);
        return Promise.resolve(data);
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return Promise.reject(error);
    }
}
exports.register = register;
/**
 *
 * @param locals
 */
async function getAccessToken(locals) {
    try {
        const checkUserSession = await UserSessionRepository.findOne({
            uuid: locals?.user?.uuid,
            user: locals?.user?._id,
            status: "active",
            // ip: locals?.user?.ip,
        });
        if (!checkUserSession) {
            return Promise.reject({
                message: user_error_message_1.USER_ERROR_MESSAGE.YOUR_DEVICE_IS_NOT_ALLOWED_TO_GET_ACCESS_TOKEN,
                statusCode: 406,
                statusCodeResponse: user_error_message_1.USER_ERROR_CODE.YOUR_DEVICE_IS_NOT_ALLOWED_TO_GET_ACCESS_TOKEN,
            });
        }
        const accessToken = await generate_jwt_1.generateAccessToken({
            _id: locals?.user?._id,
            ip: locals?.ip,
            uuid: locals?.user?.uuid,
        });
        const accessTokenKey = `AccessToken_UserId_${locals?.user?._id}_uuid_${locals?.user?.uuid}`;
        await Redis.setJson(accessTokenKey, accessToken, 60 * 60);
        const checkUserSessionExist = await UserSessionRepository.findOne({
            uuid: locals?.user?.uuid,
            user: locals?.user?._id,
            status: "active",
            ip: locals?.ip,
        });
        if (checkUserSessionExist) {
            await UserSessionRepository.save(checkUserSessionExist);
        }
        else {
            const data = await UserSessionRepository.create({
                userAgent: checkUserSession?.userAgent,
                user: locals?.user?._id,
                uuid: locals?.user?.uuid,
                status: "active",
                ip: locals?.ip,
                location: geoip_lite_1.lookup(locals?.ip),
            });
            // TODO: Send email to get AccessToken form new location
            await index_1.default.sendDataToRabbit(rabbit_config_1.JOB_NAME.ACCESS_TOKEN_FROM_NEW_LOCATION, data);
        }
        return Promise.resolve({ accessToken });
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return Promise.reject(error);
    }
}
exports.getAccessToken = getAccessToken;
/**
 *
 * @param token
 */
async function logout(token) {
    try {
        await UserSessionRepository.updateMany({
            uuid: token?.uuid,
        }, {
            status: "logout",
        });
        const accessTokenKey = `AccessToken_UserId_${token?._id}_uuid_${token?.uuid}`;
        await Redis.deleteKey(accessTokenKey);
        return Promise.resolve({
            message: user_success_message_1.USER_SUCCESS_MESSAGE.USER_HAVE_BEEN_LOGGED_OUT,
            statusCodeResponse: user_success_message_1.USER_SUCCESS_CODE.USER_HAVE_BEEN_LOGGED_OUT,
        });
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return Promise.reject(error);
    }
}
exports.logout = logout;
/**
 *
 * @param userInfo
 * @param payload
 */
async function changePassword(userInfo, payload) {
    try {
        if (payload?.oldPassword === payload?.newPassword) {
            return Promise.reject({
                message: user_error_message_1.USER_ERROR_MESSAGE.THE_NEW_PASSWORD_CANNOT_BE_THE_SAME_AS_THE_OLD_ONE,
                statusCode: 410,
                statusCodeResponse: user_error_message_1.USER_ERROR_CODE.THE_NEW_PASSWORD_CANNOT_BE_THE_SAME_AS_THE_OLD_ONE,
            });
        }
        const userData = await UserRepository.findById(userInfo?._id);
        const passwordCorrect = await bcrypt_1.compareSync(payload?.oldPassword, userData?.password);
        if (!passwordCorrect) {
            return Promise.reject({
                message: user_error_message_1.USER_ERROR_MESSAGE.PASSWORD_INCORRECT,
                statusCode: 410,
                statusCodeResponse: user_error_message_1.USER_ERROR_CODE.PASSWORD_INCORRECT,
            });
        }
        userData?.set("password", payload?.newPassword);
        await UserRepository.save(userData);
        return Promise.resolve({
            message: user_success_message_1.USER_SUCCESS_MESSAGE.PASSWORD_HAVE_BEEN_CHANGED,
            statusCodeResponse: user_success_message_1.USER_SUCCESS_CODE.PASSWORD_HAVE_BEEN_CHANGED,
        });
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return Promise.reject(error);
    }
}
exports.changePassword = changePassword;
