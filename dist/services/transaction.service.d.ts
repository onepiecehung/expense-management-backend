import { ObjectId } from "mongoose";
export declare function create(transactionInfo: any, userInfo: any): Promise<import("../interfaces/transaction.interface").ITransaction>;
export declare function findOne(transactionId: ObjectId | string): Promise<{}>;
export declare function updateOne(transactionId: ObjectId | string, transactionInfo: any, userInfo: any): Promise<{}>;
