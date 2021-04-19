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
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.logout = exports.getAccessToken = exports.getProfile = exports.register = exports.login = void 0;
const UserService = __importStar(require("../services/user.service"));
const logger_mixed_1 = require("../core/log/logger.mixed");
const response_json_1 = require("../core/response/response.json");
async function login(req, res) {
    try {
        const data = await UserService.login(req.body, res.locals);
        return response_json_1.responseSuccess(res, data, 200);
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error);
    }
}
exports.login = login;
async function register(req, res) {
    try {
        const data = await UserService.register(req.body);
        return response_json_1.responseSuccess(res, data, 201);
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error);
    }
}
exports.register = register;
async function getProfile(req, res) {
    try {
        return response_json_1.responseSuccess(res, res.locals?.user, 200);
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error);
    }
}
exports.getProfile = getProfile;
async function getAccessToken(req, res) {
    try {
        const data = await UserService.getAccessToken(res.locals);
        return response_json_1.responseSuccess(res, data, 200);
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error);
    }
}
exports.getAccessToken = getAccessToken;
async function logout(req, res) {
    try {
        const data = await UserService.logout(res.locals?.token);
        return response_json_1.responseSuccess(res, data, 200);
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error);
    }
}
exports.logout = logout;
async function changePassword(req, res) {
    try {
        const data = await UserService.changePassword(res.locals?.user, req.body);
        return response_json_1.responseSuccess(res, data, 200);
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error);
    }
}
exports.changePassword = changePassword;
