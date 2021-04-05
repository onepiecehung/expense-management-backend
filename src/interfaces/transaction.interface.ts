import { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
    user?: Schema.Types.ObjectId | string;
    price?: number;
    currency?: string;
    status?: number;
}
