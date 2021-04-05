import { NextFunction, Request, Response } from "express";
import UAParser from "ua-parser-js";

import { JOB_NAME } from "../../config/rabbit.config";
import RABBIT from "../../connector/rabbitmq/init/index";
import { logger } from "../../core/log/logger.mixed";
import { getToken } from "../jwt/auth.jwt.middleware";

export async function log(req: Request, res: Response, next: NextFunction) {
    try {
        const start = process.hrtime();
        const userAgent = new UAParser(req.headers["user-agent"]).getResult();
        const ip = res.locals?.ip;
        const token = getToken(req.headers);

        const payload: JSON | any = {
            method: req.method,
            httpVersion: req.httpVersion,
            hostname: req.hostname,
            originalUrl: req.originalUrl,
            protocol: req.protocol,
            ip: ip,
            token: token,
            userAgent: userAgent,
            body: req.body,
            query: req.query,
        };

        const getDurationInMilliseconds = (start: any) => {
            const NS_PER_SEC = 1e9;
            const NS_TO_MS = 1e6;
            const diff = process.hrtime(start);

            return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
        };

        res.on("finish", () => {
            Object.assign(payload, {
                finishedTimeMs: getDurationInMilliseconds(start),
                isFinishedTime: true,
                uuid: res.locals.uuid,
            });
            RABBIT.sendDataToRabbit(JOB_NAME.LOG_ACTION, payload);
        });

        res.on("close", () => {
            Object.assign(payload, {
                closingTimeMs: getDurationInMilliseconds(start),
                isClosingTime: true,
                uuid: res.locals.uuid,
            });
            RABBIT.sendDataToRabbit(JOB_NAME.LOG_ACTION, payload);
        });

        next();
    } catch (error) {
        logger.error(error);
        next();
    }
}
