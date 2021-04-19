"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTransactionValidator = exports.TransactionIDValidator = exports.TransactionValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_mixed_1 = require("../core/log/logger.mixed");
const response_json_1 = require("../core/response/response.json");
const TransactionValidationSchema = joi_1.default.object({
    note: joi_1.default.string().required().allow(null),
    date: joi_1.default.date().required().allow(null),
    price: joi_1.default.string().required().allow(null),
    currency: joi_1.default.string().required().allow(null),
    category: joi_1.default.string().required().allow(null),
});
const TransactionIDValidationSchema = joi_1.default.object({
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
async function TransactionValidator(req, res, next) {
    try {
        await TransactionValidationSchema.validateAsync(req.body);
        next();
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error, 412);
    }
}
exports.TransactionValidator = TransactionValidator;
/**
 *
 * @param req
 * @param res
 * @param next
 */
async function TransactionIDValidator(req, res, next) {
    try {
        await TransactionIDValidationSchema.validateAsync(req.params);
        next();
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error, 412);
    }
}
exports.TransactionIDValidator = TransactionIDValidator;
/**
 *
 * @param req
 * @param res
 * @param next
 */
async function UpdateTransactionValidator(req, res, next) {
    try {
        await Promise.all([
            TransactionValidationSchema.validateAsync(req.body),
            TransactionIDValidationSchema.validateAsync(req.params),
        ]);
        next();
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error, 412);
    }
}
exports.UpdateTransactionValidator = UpdateTransactionValidator;
