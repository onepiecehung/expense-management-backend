import { ObjectId } from "mongoose";
/**
 *
 * @param {Object} transactionInfo
 */
export declare function save(transactionInfo: any): Promise<any>;
/**
 *
 * @param {Object} transactionInfo
 */
export declare function create(transactionInfo: any): Promise<import("../interfaces/transaction.interface").ITransaction>;
/**
 *
 * @param {String} email
 */
export declare function findByEmail(email: string | any | null): Promise<import("../interfaces/transaction.interface").ITransaction | null>;
/**
 *
 * @param {Object} query
 */
export declare function findOne(query: any): Promise<import("../interfaces/transaction.interface").ITransaction | null>;
/**
 *
 * @param transactionInfo
 */
export declare function createModel(transactionInfo: any): Promise<import("../interfaces/transaction.interface").ITransaction>;
/**
 *
 * @param userId
 */
export declare function findById(userId: ObjectId | string): Promise<import("../interfaces/transaction.interface").ITransaction | null>;
export declare function createModelEmpty(): Promise<import("../interfaces/transaction.interface").ITransaction>;
export declare function updateOne(transactionId: ObjectId | string, transactionInfo: any): Promise<import("../interfaces/transaction.interface").ITransaction | null>;
