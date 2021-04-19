import { Request, Response } from "express";
/**
 *
 * @param {Response} res
 * @param {Object} data
 * @param {number} statusCode
 * @param {number} statusCodeResponse
 */
export declare function responseSuccess(res?: Response, data?: Object | any, statusCode?: number, statusCodeResponse?: number): Promise<Response<any, Record<string, any>> | undefined>;
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Object} error
 * @param {number} statusCode
 * @param {number} statusCodeResponse
 */
export declare function responseError(req?: Request, res?: Response, error?: Object | any, statusCode?: number, statusCodeResponse?: number): Promise<Response<any, Record<string, any>> | undefined>;
export declare function responseWSSuccess(data: Object | any, statusCode?: number, statusMessage?: string, statusCodeResponse?: number): JSON | Object | any;
export declare function responseWSError(data: Object | any, statusCode?: number, statusMessage?: string, statusCodeResponse?: number): JSON | Object | any;
