import CategoryModel from "../models/category.model";
import { ObjectId } from "mongoose";
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
export async function save(categoryInfo: any) {
    return categoryInfo.save();
}

/**
 *
 * @param {Object} categoryInfo
 */
export async function create(categoryInfo: any) {
    const categoryClass = new CategoryModel(categoryInfo);
    return categoryClass.save();
}

/**
 *
 * @param {Object} query
 */
export async function findOne(query: any) {
    return CategoryModel.findOne(query);
}

/**
 *
 * @param categoryInfo
 */
export async function createModel(categoryInfo: any) {
    return new CategoryModel(categoryInfo);
}

/**
 *
 * @param categoryId
 */
export async function findById(categoryId: ObjectId | string) {
    return CategoryModel.findById(categoryId);
}

export async function createModelEmpty() {
    return new CategoryModel();
}

export async function updateOne(
    categoryId: ObjectId | string,
    categoryInfo: any
) {
    return CategoryModel.findByIdAndUpdate(categoryId, categoryInfo, {
        new: true,
    });
}
