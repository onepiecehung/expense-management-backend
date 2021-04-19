"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOne = exports.findOne = exports.create = void 0;
const logger_mixed_1 = require("../core/log/logger.mixed");
const transaction_message_1 = require("../messages/errors/transaction.message");
const TransactionRepository = __importStar(require("../repository/transaction.repository"));
async function create(transactionInfo, userInfo) {
    try {
        transactionInfo = Object.assign(transactionInfo, {
            user: userInfo._id,
        });
        const data = await TransactionRepository.create(transactionInfo);
        return Promise.resolve(data);
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return Promise.reject(error);
    }
}
exports.create = create;
async function findOne(transactionId) {
    try {
        const data = await TransactionRepository.findById(transactionId);
        return Promise.resolve(data ? data : {});
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return Promise.reject(error);
    }
}
exports.findOne = findOne;
async function updateOne(transactionId, transactionInfo, userInfo) {
    try {
        const transaction = await TransactionRepository.findById(transactionId);
        if (transaction.user.toString() != userInfo._id) {
            return Promise.reject({
                message: transaction_message_1.TRANSACTION_MESSAGE.FORBIDDEN,
                statusCode: 403,
            });
        }
        const data = await TransactionRepository.updateOne(transactionId, transactionInfo);
        return Promise.resolve(data ? data : {});
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return Promise.reject(error);
    }
}
exports.updateOne = updateOne;
