import { ObjectId } from "mongoose";

import { logger } from "../core/log/logger.mixed";
import { TRANSACTION_MESSAGE } from "../messages/errors/transaction.message";
import * as TransactionRepository from "../repository/transaction.repository";

export async function create(transactionInfo: any, userInfo: any) {
    try {
        transactionInfo = Object.assign(transactionInfo, {
            user: userInfo._id,
        });
        const data = await TransactionRepository.create(transactionInfo);
        return Promise.resolve(data);
    } catch (error) {
        logger.error(error);
        return Promise.reject(error);
    }
}

export async function findOne(transactionId: ObjectId | string) {
    try {
        const data = await TransactionRepository.findById(transactionId);
        return Promise.resolve(data ? data : {});
    } catch (error) {
        logger.error(error);
        return Promise.reject(error);
    }
}

export async function updateOne(
    transactionId: ObjectId | string,
    transactionInfo: any,
    userInfo: any
) {
    try {
        const transaction: any = await TransactionRepository.findById(
            transactionId
        );
        if (transaction.user.toString() != userInfo._id) {
            return Promise.reject({
                message: TRANSACTION_MESSAGE.FORBIDDEN,
                statusCode: 403,
            });
        }
        const data = await TransactionRepository.updateOne(
            transactionId,
            transactionInfo
        );
        return Promise.resolve(data ? data : {});
    } catch (error) {
        logger.error(error);
        return Promise.reject(error);
    }
}
