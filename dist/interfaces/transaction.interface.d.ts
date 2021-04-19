import { ObjectId, Document, Date } from "mongoose";
export interface ITransaction extends Document {
    user?: ObjectId | string;
    date?: Date;
    price?: number;
    currency?: string;
    category?: string;
    status?: number;
}
