import { logger } from "../core/log/logger.mixed";
import * as CategoryRepository from "../repository/category.repository";
import { ObjectId } from "mongoose";

export async function create(categoryInfo: any) {
    try {
        const data = await CategoryRepository.create(categoryInfo);
        return Promise.resolve(data);
    } catch (error) {
        logger.error(error);
        return Promise.reject(error);
    }
}

export async function findOne(categoryID: ObjectId | string) {
    try {
        const data = await CategoryRepository.findById(categoryID);
        return Promise.resolve(data ? data : {});
    } catch (error) {
        logger.error(error);
        return Promise.reject(error);
    }
}

export async function updateOne(
    categoryID: ObjectId | string,
    categoryInfo: any
) {
    try {
        const data = await CategoryRepository.updateOne(
            categoryID,
            categoryInfo
        );
        return Promise.resolve(data ? data : {});
    } catch (error) {
        logger.error(error);
        return Promise.reject(error);
    }
}
