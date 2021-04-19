import { ObjectId } from "mongoose";
export declare function create(categoryInfo: any): Promise<import("../interfaces/category.interface").ICategory>;
export declare function findOne(categoryID: ObjectId | string): Promise<{}>;
export declare function updateOne(categoryID: ObjectId | string, categoryInfo: any): Promise<{}>;
