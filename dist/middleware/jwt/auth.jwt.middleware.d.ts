import { NextFunction, Request, Response } from "express";
import { Socket } from "socket.io";
export declare function getToken(headers: any): any;
export declare function Authentication(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
export declare function AuthorizationRefreshToken(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
export declare function AuthenticationWebSocket(socket: Socket | any, next?: any): Promise<any>;
