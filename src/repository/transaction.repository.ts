import TransactionModel from "../models/transaction.model";
import { ObjectId } from "mongoose";
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
export async function save(transactionInfo: any) {
    return transactionInfo.save();
}

/**
 *
 * @param {Object} transactionInfo
 */
export async function create(transactionInfo: any) {
    const transactionClass = new TransactionModel(transactionInfo);
    return transactionClass.save();
}

/**
 *
 * @param {String} email
 */
export async function findByEmail(email: string | any | null) {
    return TransactionModel.findOne({ email: email?.toLowerCase() });
}

/**
 *
 * @param {Object} query
 */
export async function findOne(query: any) {
    return TransactionModel.findOne(query);
}

/**
 *
 * @param transactionInfo
 */
export async function createModel(transactionInfo: any) {
    return new TransactionModel(transactionInfo);
}

/**
 *
 * @param userId
 */
export async function findById(userId: ObjectId | string) {
    return TransactionModel.findById(userId);
}

export async function createModelEmpty() {
    return new TransactionModel();
}

export async function updateOne(
    transactionId: ObjectId | string,
    transactionInfo: any
) {
    return TransactionModel.findByIdAndUpdate(transactionId, transactionInfo, {
        new: true,
    });
}
