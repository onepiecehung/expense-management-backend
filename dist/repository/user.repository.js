"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModelEmpty = exports.findById = exports.createModel = exports.findOne = exports.findByEmail = exports.create = exports.save = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
// !important: session only using for transaction => don't using it for 1 query
/**
 *
 * @param {Object} userInfo
 */
// export async function save(userInfo: any) {
//     let session: any = await mongoose.startSession();
//     try {
//         session.startTransaction();
//         let data = await userInfo.save({
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
async function save(userInfo) {
    return userInfo.save();
}
exports.save = save;
/**
 *
 * @param {Object} userInfo
 */
async function create(userInfo) {
    const userClass = new user_model_1.default(userInfo);
    return userClass.save();
}
exports.create = create;
/**
 *
 * @param {String} email
 */
async function findByEmail(email) {
    return user_model_1.default.findOne({ email: email?.toLowerCase() });
}
exports.findByEmail = findByEmail;
/**
 *
 * @param {Object} query
 */
async function findOne(query) {
    return user_model_1.default.findOne(query);
}
exports.findOne = findOne;
/**
 *
 * @param userInfo
 */
async function createModel(userInfo) {
    return new user_model_1.default(userInfo);
}
exports.createModel = createModel;
/**
 *
 * @param userId
 */
async function findById(userId) {
    return user_model_1.default.findById(userId);
}
exports.findById = findById;
async function createModelEmpty() {
    return new user_model_1.default();
}
exports.createModelEmpty = createModelEmpty;
