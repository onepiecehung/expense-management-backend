"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMany = exports.find = exports.findOneAndUpdateUpsert = exports.findById = exports.createModel = exports.findOne = exports.create = exports.save = void 0;
const userSession_model_1 = __importDefault(require("../models/userSession.model"));
// !important: session only using for transaction => don't using it for 1 query
/**
 *
 * @param {Object} userSessionInfo
 */
// export async function save(userSessionInfo: any) {
//     let session: any = await mongoose.startSession();
//     try {
//         session.startTransaction();
//         let data = await userSessionInfo.save({
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
async function save(userSessionInfo) {
    return userSessionInfo.save();
}
exports.save = save;
/**
 *
 * @param {Object} userSessionInfo
 */
async function create(userSessionInfo) {
    const userSessionClass = new userSession_model_1.default(userSessionInfo);
    return userSessionClass.save();
}
exports.create = create;
/**
 *
 * @param {Object} query
 */
async function findOne(query) {
    return userSession_model_1.default.findOne(query);
}
exports.findOne = findOne;
/**
 *
 * @param userSessionInfo
 */
async function createModel(userSessionInfo) {
    return new userSession_model_1.default(userSessionInfo);
}
exports.createModel = createModel;
/**
 *
 * @param userSessionId
 */
async function findById(userSessionId) {
    return userSession_model_1.default.findById(userSessionId);
}
exports.findById = findById;
/**
 *
 * @param filters
 * @param update
 */
async function findOneAndUpdateUpsert(filters, update) {
    return userSession_model_1.default.updateOne(filters, { $set: update }, {
        upsert: true,
    });
}
exports.findOneAndUpdateUpsert = findOneAndUpdateUpsert;
/**
 *
 * @param filters
 */
async function find(filters) {
    return userSession_model_1.default.find(filters);
}
exports.find = find;
/**
 *
 * @param filters
 * @param update
 */
async function updateMany(filters, update) {
    return userSession_model_1.default.updateMany(filters, update);
}
exports.updateMany = updateMany;
