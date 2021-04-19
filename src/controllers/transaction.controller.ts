import { Request, Response } from "express";

import { logger } from "../core/log/logger.mixed";
import { responseError, responseSuccess } from "../core/response/response.json";
import * as TransactionService from "../services/transaction.service";

export async function create(req: Request, res: Response) {
    try {
        const data: any = await TransactionService.create(
            req.body,
            res.locals.user
        );
        return responseSuccess(res, data, 200);
    } catch (error) {
        logger.error(error);
        return responseError(req, res, error);
    }
}

export async function findOne(req: Request, res: Response) {
    try {
        const data: any = await TransactionService.findOne(req.params.id);
        return responseSuccess(res, data, 200);
    } catch (error) {
        logger.error(error);
        return responseError(req, res, error);
    }
}

export async function updateOne(req: Request, res: Response) {
    try {
        const data: any = await TransactionService.updateOne(
            req.params.id,
            req.body,
            res.locals.user
        );
        return responseSuccess(res, data, 200);
    } catch (error) {
        logger.error(error);
        return responseError(req, res, error);
    }
}
