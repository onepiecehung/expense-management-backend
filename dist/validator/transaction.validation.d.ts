import { NextFunction, Request, Response } from "express";
/**
 *
 * @param req
 * @param res
 * @param next
 */
export declare function TransactionValidator(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 *
 * @param req
 * @param res
 * @param next
 */
export declare function TransactionIDValidator(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 *
 * @param req
 * @param res
 * @param next
 */
export declare function UpdateTransactionValidator(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
