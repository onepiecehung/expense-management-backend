import { Request, Response } from "express";
export declare function create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function findOne(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function updateOne(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
