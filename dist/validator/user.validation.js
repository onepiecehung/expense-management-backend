"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordValidator = exports.RegisterValidator = exports.LoginValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_mixed_1 = require("../core/log/logger.mixed");
const response_json_1 = require("../core/response/response.json");
const LoginValidationSchema = joi_1.default.object({
    id: joi_1.default.string().min(3).max(30).trim(),
    password: joi_1.default.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .trim()
        .required(),
}).with("id", "password");
const RegisterValidationSchema = joi_1.default.object({
    username: joi_1.default.string().alphanum().min(3).max(30).trim().required(),
    password: joi_1.default.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .trim()
        .required(),
    email: joi_1.default.string().email().trim().required(),
    lastName: joi_1.default.string().trim().allow(""),
    firstName: joi_1.default.string().trim().allow(""),
    gender: joi_1.default.number().min(0).max(2).allow(""),
    birthday: joi_1.default.date().allow(""),
    phoneNumber: joi_1.default.string().trim().allow(""),
})
    .with("username", "password")
    .with("email", "password");
const ChangePasswordValidationSchema = joi_1.default.object({
    oldPassword: joi_1.default.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .trim()
        .required(),
    newPassword: joi_1.default.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .trim()
        .required(),
}).with("oldPassword", "newPassword");
/**
 *
 * @param req
 * @param res
 * @param next
 */
async function LoginValidator(req, res, next) {
    try {
        await LoginValidationSchema.validateAsync(req.body);
        next();
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error, 412);
    }
}
exports.LoginValidator = LoginValidator;
/**
 *
 * @param req
 * @param res
 * @param next
 */
async function RegisterValidator(req, res, next) {
    try {
        await RegisterValidationSchema.validateAsync(req.body);
        next();
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error, 412);
    }
}
exports.RegisterValidator = RegisterValidator;
/**
 *
 * @param req
 * @param res
 * @param next
 */
async function ChangePasswordValidator(req, res, next) {
    try {
        await ChangePasswordValidationSchema.validateAsync(req.body);
        next();
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error, 412);
    }
}
exports.ChangePasswordValidator = ChangePasswordValidator;
