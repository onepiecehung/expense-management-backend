import { ObjectId } from "mongoose";
/**
 *
 * @param {Object} categoryInfo
 */
export declare function save(categoryInfo: any): Promise<any>;
/**
 *
 * @param {Object} categoryInfo
 */
export declare function create(categoryInfo: any): Promise<import("../interfaces/category.interface").ICategory>;
/**
 *
 * @param {Object} query
 */
export declare function findOne(query: any): Promise<import("../interfaces/category.interface").ICategory | null>;
/**
 *
 * @param categoryInfo
 */
export declare function createModel(categoryInfo: any): Promise<import("../interfaces/category.interface").ICategory>;
/**
 *
 * @param categoryId
 */
export declare function findById(categoryId: ObjectId | string): Promise<import("../interfaces/category.interface").ICategory | null>;
export declare function createModelEmpty(): Promise<import("../interfaces/category.interface").ICategory>;
export declare function updateOne(categoryId: ObjectId | string, categoryInfo: any): Promise<import("../interfaces/category.interface").ICategory | null>;
