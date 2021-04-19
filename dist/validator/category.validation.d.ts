import { NextFunction, Request, Response } from "express";
/**
 *
 * @param req
 * @param res
 * @param next
 */
export declare function CategoryValidator(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 *
 * @param req
 * @param res
 * @param next
 */
export declare function CategoryIDValidator(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 *
 * @param req
 * @param res
 * @param next
 */
export declare function UpdateCategoryValidator(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
