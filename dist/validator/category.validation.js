"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCategoryValidator = exports.CategoryIDValidator = exports.CategoryValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_mixed_1 = require("../core/log/logger.mixed");
const response_json_1 = require("../core/response/response.json");
const CategoryValidationSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(50).trim().required(),
    description: joi_1.default.string().min(6).max(200).trim().required(),
}).with("name", "description");
const CategoryIDValidationSchema = joi_1.default.object({
    id: joi_1.default.string()
        .required()
        .regex(/^[0-9a-fA-F]{24}$/)
        .error(() => {
        throw new Error("ID must be ObjectId");
    }),
});
/**
 *
 * @param req
 * @param res
 * @param next
 */
async function CategoryValidator(req, res, next) {
    try {
        await CategoryValidationSchema.validateAsync(req.body);
        next();
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error, 412);
    }
}
exports.CategoryValidator = CategoryValidator;
/**
 *
 * @param req
 * @param res
 * @param next
 */
async function CategoryIDValidator(req, res, next) {
    try {
        await CategoryIDValidationSchema.validateAsync(req.params);
        next();
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error, 412);
    }
}
exports.CategoryIDValidator = CategoryIDValidator;
/**
 *
 * @param req
 * @param res
 * @param next
 */
async function UpdateCategoryValidator(req, res, next) {
    try {
        await Promise.all([
            CategoryValidationSchema.validateAsync(req.body),
            CategoryIDValidationSchema.validateAsync(req.params),
        ]);
        next();
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error, 412);
    }
}
exports.UpdateCategoryValidator = UpdateCategoryValidator;
