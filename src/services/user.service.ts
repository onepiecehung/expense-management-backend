import { compareSync } from "bcrypt";
import { lookup } from "geoip-lite";

import { JOB_NAME } from "../config/rabbit.config";
import RABBIT from "../connector/rabbitmq/init/index";
import * as Redis from "../connector/redis/index";
import { IUser, IUserSession } from "../interfaces/user.interface";
import {
    USER_ERROR_CODE,
    USER_ERROR_MESSAGE,
} from "../messages/errors/user.error.message";
import {
    USER_SUCCESS_CODE,
    USER_SUCCESS_MESSAGE,
} from "../messages/success/user.success.message";
import * as UserRepository from "../repository/user.repository";
import * as UserSessionRepository from "../repository/userSession.repository";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../core/jwt/generate.jwt";
import { logger } from "../core/log/logger.mixed";

/**
 *
 * @param {Object} userInfo
 */
export async function login(userInfo: IUser, locals: any) {
    try {
        const uuid: any = locals?.uuid;
        const userAgent: any = locals?.userAgent;
        const ip: any = locals?.ip;

        const userData: IUser | null = await UserRepository.findOne({
            $or: [
                {
                    username: userInfo.id,
                },
                {
                    email: userInfo.id,
                },
            ],
        });

        if (!userData) {
            return Promise.reject({
                message: USER_ERROR_MESSAGE.USERNAME_NOT_FOUND,
                statusCode: 410,
                statusCodeResponse: USER_ERROR_CODE.USERNAME_NOT_FOUND,
            });
        }

        if (userData?.status !== "active") {
            return Promise.reject({
                message: USER_ERROR_MESSAGE.USER_HAS_BEED_ + userData?.status,
                statusCode: 410,
                statusCodeResponse: USER_ERROR_CODE.USER_HAS_BEED_,
            });
        }

        const passwordCorrect = await compareSync(
            userInfo?.password,
            userData?.password
        );

        if (!passwordCorrect) {
            return Promise.reject({
                message: USER_ERROR_MESSAGE.PASSWORD_INCORRECT,
                statusCode: 410,
                statusCodeResponse: USER_ERROR_CODE.PASSWORD_INCORRECT,
            });
        }

        const accessToken: any = await generateAccessToken({
            _id: userData?._id,
            ip: ip,
            uuid: uuid,
        });

        const tokenRedisKey: string = `AccessToken_UserId_${userData?._id}_uuid_${uuid}`;

        await Redis.setJson(tokenRedisKey, accessToken, 60 * 60);

        const refreshToken: any = await generateRefreshToken({
            _id: userData?._id,
            ip: ip,
            uuid: uuid,
        });

        await RABBIT.sendDataToRabbit(JOB_NAME.USER_SESSION_WRITE, {
            user: userData?._id,
            userAgent: userAgent?.getResult(),
            ip: ip,
            uuid: uuid,
        });

        return Promise.resolve({
            user: userData?.toJSON(),
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    } catch (error) {
        logger.error(error);
        return Promise.reject(error);
    }
}

/**
 *
 * @param {Object} userInfo
 */
export async function register(userInfo: IUser) {
    try {
        const checkEmail: IUser | null = await UserRepository.findByEmail(
            userInfo?.email
        );

        if (checkEmail) {
            return Promise.reject({
                message: USER_ERROR_MESSAGE.EMAIL_EXIST,
                statusCode: 410,
                statusCodeResponse: USER_ERROR_CODE.EMAIL_EXIST,
            });
        }
        const checkUsername: IUser | null = await UserRepository.findOne({
            username: userInfo?.username?.toLowerCase(),
        });
        if (checkUsername) {
            return Promise.reject({
                message: USER_ERROR_MESSAGE.USERNAME_EXIST,
                statusCode: 410,
                statusCodeResponse: USER_ERROR_CODE.USERNAME_EXIST,
            });
        }
        const data: IUser = await UserRepository.create(userInfo);
        return Promise.resolve(data);
    } catch (error) {
        logger.error(error);
        return Promise.reject(error);
    }
}

/**
 *
 * @param locals
 */
export async function getAccessToken(locals: any) {
    try {
        const checkUserSession: IUserSession | null = await UserSessionRepository.findOne(
            {
                uuid: locals?.user?.uuid,
                user: locals?.user?._id,
                status: "active",
                // ip: locals?.user?.ip,
            }
        );

        if (!checkUserSession) {
            return Promise.reject({
                message:
                    USER_ERROR_MESSAGE.YOUR_DEVICE_IS_NOT_ALLOWED_TO_GET_ACCESS_TOKEN,
                statusCode: 406,
                statusCodeResponse:
                    USER_ERROR_CODE.YOUR_DEVICE_IS_NOT_ALLOWED_TO_GET_ACCESS_TOKEN,
            });
        }

        const accessToken: any = await generateAccessToken({
            _id: locals?.user?._id,
            ip: locals?.ip,
            uuid: locals?.user?.uuid,
        });
        const accessTokenKey: string = `AccessToken_UserId_${locals?.user?._id}_uuid_${locals?.user?.uuid}`;

        await Redis.setJson(accessTokenKey, accessToken, 60 * 60);

        const checkUserSessionExist: IUserSession | null = await UserSessionRepository.findOne(
            {
                uuid: locals?.user?.uuid,
                user: locals?.user?._id,
                status: "active",
                ip: locals?.ip,
            }
        );

        if (checkUserSessionExist) {
            await UserSessionRepository.save(checkUserSessionExist);
        } else {
            const data = await UserSessionRepository.create({
                userAgent: checkUserSession?.userAgent,
                user: locals?.user?._id,
                uuid: locals?.user?.uuid,
                status: "active",
                ip: locals?.ip,
                location: lookup(locals?.ip),
            });

            // TODO: Send email to get AccessToken form new location
            await RABBIT.sendDataToRabbit(
                JOB_NAME.ACCESS_TOKEN_FROM_NEW_LOCATION,
                data
            );
        }

        return Promise.resolve({ accessToken });
    } catch (error) {
        logger.error(error);
        return Promise.reject(error);
    }
}

/**
 *
 * @param token
 */
export async function logout(token: any) {
    try {
        await UserSessionRepository.updateMany(
            {
                uuid: token?.uuid,
            },
            {
                status: "logout",
            }
        );

        const accessTokenKey: string = `AccessToken_UserId_${token?._id}_uuid_${token?.uuid}`;

        await Redis.deleteKey(accessTokenKey);

        return Promise.resolve({
            message: USER_SUCCESS_MESSAGE.USER_HAVE_BEEN_LOGGED_OUT,
            statusCodeResponse: USER_SUCCESS_CODE.USER_HAVE_BEEN_LOGGED_OUT,
        });
    } catch (error) {
        logger.error(error);
        return Promise.reject(error);
    }
}

/**
 *
 * @param userInfo
 * @param payload
 */
export async function changePassword(userInfo: IUser, payload: any) {
    try {
        if (payload?.oldPassword === payload?.newPassword) {
            return Promise.reject({
                message:
                    USER_ERROR_MESSAGE.THE_NEW_PASSWORD_CANNOT_BE_THE_SAME_AS_THE_OLD_ONE,
                statusCode: 410,
                statusCodeResponse:
                    USER_ERROR_CODE.THE_NEW_PASSWORD_CANNOT_BE_THE_SAME_AS_THE_OLD_ONE,
            });
        }

        const userData: IUser | null = await UserRepository.findById(
            userInfo?._id
        );

        const passwordCorrect = await compareSync(
            payload?.oldPassword,
            userData?.password
        );

        if (!passwordCorrect) {
            return Promise.reject({
                message: USER_ERROR_MESSAGE.PASSWORD_INCORRECT,
                statusCode: 410,
                statusCodeResponse: USER_ERROR_CODE.PASSWORD_INCORRECT,
            });
        }

        userData?.set("password", payload?.newPassword);

        await UserRepository.save(userData);

        return Promise.resolve({
            message: USER_SUCCESS_MESSAGE.PASSWORD_HAVE_BEEN_CHANGED,
            statusCodeResponse: USER_SUCCESS_CODE.PASSWORD_HAVE_BEEN_CHANGED,
        });
    } catch (error) {
        logger.error(error);
        return Promise.reject(error);
    }
}
