"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOne = exports.createModelEmpty = exports.findById = exports.createModel = exports.findOne = exports.create = exports.save = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
// !important: session only using for transaction => don't using it for 1 query
/**
 *
 * @param {Object} categoryInfo
 */
// export async function save(categoryInfo: any) {
//     let session: any = await mongoose.startSession();
//     try {
//         session.startTransaction();
//         let data = await categoryInfo.save({
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
async function save(categoryInfo) {
    return categoryInfo.save();
}
exports.save = save;
/**
 *
 * @param {Object} categoryInfo
 */
async function create(categoryInfo) {
    const categoryClass = new category_model_1.default(categoryInfo);
    return categoryClass.save();
}
exports.create = create;
/**
 *
 * @param {Object} query
 */
async function findOne(query) {
    return category_model_1.default.findOne(query);
}
exports.findOne = findOne;
/**
 *
 * @param categoryInfo
 */
async function createModel(categoryInfo) {
    return new category_model_1.default(categoryInfo);
}
exports.createModel = createModel;
/**
 *
 * @param categoryId
 */
async function findById(categoryId) {
    return category_model_1.default.findById(categoryId);
}
exports.findById = findById;
async function createModelEmpty() {
    return new category_model_1.default();
}
exports.createModelEmpty = createModelEmpty;
async function updateOne(categoryId, categoryInfo) {
    return category_model_1.default.findByIdAndUpdate(categoryId, categoryInfo, {
        new: true,
    });
}
exports.updateOne = updateOne;
