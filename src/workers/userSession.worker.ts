import { JOB_NAME } from "../config/rabbit.config";
import RABBIT from "../connector/rabbitmq/init/index";
import * as UserSessionRepository from "../repository/user.session.repository";
import { logger } from "../core/log/logger.mixed";
import { lookup } from "geoip-lite";

RABBIT?.consumeData(
    JOB_NAME.USER_SESSION_WRITE,
    async (msg: any, channel: any) => {
        try {
            const message: any = JSON.parse(msg.content.toString());
            let userSession: any = { ...message };

            userSession = Object.assign(userSession, {
                location: lookup(userSession.ip),
            });

            await UserSessionRepository.create(userSession);
            logger.warn(`Write user session success`);

            channel.ack(msg);

            return true;
        } catch (error) {
            logger.error(`Write session failed`);
            logger.error(error);
            channel.nack(msg);
            return false;
        }
    }
);
