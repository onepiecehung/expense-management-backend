import { NextFunction, Request, Response } from "express";
import Joi from "joi";

import { logger } from "../core/log/logger.mixed";
import { responseError } from "../core/response/response.json";

const TransactionValidationSchema = Joi.object({
    note: Joi.string().required().allow(null),
    date: Joi.date().required().allow(null),
    price: Joi.string().required().allow(null),
    currency: Joi.string().required().allow(null),
    category: Joi.string().required().allow(null),
});

const TransactionIDValidationSchema = Joi.object({
    id: Joi.string()
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
export async function TransactionValidator(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        await TransactionValidationSchema.validateAsync(req.body);
        next();
    } catch (error) {
        logger.error(error);
        return responseError(req, res, error, 412);
    }
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
export async function TransactionIDValidator(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        await TransactionIDValidationSchema.validateAsync(req.params);
        next();
    } catch (error) {
        logger.error(error);
        return responseError(req, res, error, 412);
    }
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
export async function UpdateTransactionValidator(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        await Promise.all([
            TransactionValidationSchema.validateAsync(req.body),
            TransactionIDValidationSchema.validateAsync(req.params),
        ]);
        next();
    } catch (error) {
        logger.error(error);
        return responseError(req, res, error, 412);
    }
}
