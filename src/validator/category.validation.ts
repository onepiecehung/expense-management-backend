import { NextFunction, Request, Response } from "express";
import Joi from "joi";

import { logger } from "../core/log/logger.mixed";
import { responseError } from "../core/response/response.json";

const CategoryValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).trim().required(),
    description: Joi.string().min(6).max(200).trim().required(),
}).with("name", "description");

const CategoryIDValidationSchema = Joi.object({
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
export async function CategoryValidator(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        await CategoryValidationSchema.validateAsync(req.body);
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
export async function CategoryIDValidator(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        await CategoryIDValidationSchema.validateAsync(req.params);
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
export async function UpdateCategoryValidator(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        await CategoryValidationSchema.validateAsync(req.body);
        await CategoryIDValidationSchema.validateAsync(req.params);
        next();
    } catch (error) {
        logger.error(error);
        return responseError(req, res, error, 412);
    }
}
