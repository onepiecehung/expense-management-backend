"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOne = exports.createModelEmpty = exports.findById = exports.createModel = exports.findOne = exports.findByEmail = exports.create = exports.save = void 0;
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
// !important: session only using for transaction => don't using it for 1 query
/**
 *
 * @param {Object} transactionInfo
 */
// export async function save(transactionInfo: any) {
//     let session: any = await mongoose.startSession();
//     try {
//         session.startTransaction();
//         let data = await transactionInfo.save({
//             session: session,
//         });
//         await session.commitTransaction();
//         session.endSession();
//         return data;
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         return false;
//     }
// }
async function save(transactionInfo) {
    return transactionInfo.save();
}
exports.save = save;
/**
 *
 * @param {Object} transactionInfo
 */
async function create(transactionInfo) {
    const transactionClass = new transaction_model_1.default(transactionInfo);
    return transactionClass.save();
}
exports.create = create;
/**
 *
 * @param {String} email
 */
async function findByEmail(email) {
    return transaction_model_1.default.findOne({ email: email?.toLowerCase() });
}
exports.findByEmail = findByEmail;
/**
 *
 * @param {Object} query
 */
async function findOne(query) {
    return transaction_model_1.default.findOne(query);
}
exports.findOne = findOne;
/**
 *
 * @param transactionInfo
 */
async function createModel(transactionInfo) {
    return new transaction_model_1.default(transactionInfo);
}
exports.createModel = createModel;
/**
 *
 * @param userId
 */
async function findById(userId) {
    return transaction_model_1.default.findById(userId);
}
exports.findById = findById;
async function createModelEmpty() {
    return new transaction_model_1.default();
}
exports.createModelEmpty = createModelEmpty;
async function updateOne(transactionId, transactionInfo) {
    return transaction_model_1.default.findByIdAndUpdate(transactionId, transactionInfo, {
        new: true,
    });
}
exports.updateOne = updateOne;
