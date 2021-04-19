import { model, Schema } from "mongoose";

import { logger } from "../core/log/logger.mixed";
import { ITransaction } from "../interfaces/transaction.interface";
import UserModel from "./user.model";

const TransactionSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: UserModel,
            index: true,
        },
        date: {
            type: Schema.Types.Date,
            required: true,
        },
        price: {
            type: Schema.Types.Number,
            required: true,
        },
        currency: {
            type: Schema.Types.String,
            required: true,
        },
        category: {
            type: Schema.Types.String,
            required: true,
        },
        note: {
            type: Schema.Types.String,
        },
        status: {
            type: Schema.Types.Number,
            default: 1,
        },
    },
    {
        timestamps: true,
        collection: "Transactions",
    }
);

TransactionSchema.set("toJSON", {
    transform: (doc: any, ret: any) => {
        ret.createdAt = ret.createdAt?.getTime();
        ret.updatedAt = ret.updatedAt?.getTime();
        ret.date = ret.date?.getTime();
        delete ret.status;
        delete ret.__v;
    },
});

TransactionSchema.set("toObject", {
    transform: (doc: any, ret: any) => {
        ret.createdAt = ret.createdAt?.getTime();
        ret.updatedAt = ret.updatedAt?.getTime();
        ret.date = ret.date?.getTime();
        delete ret.status;
        delete ret.__v;
    },
});

// TODO: After write document
TransactionSchema.pre<ITransaction>("save", async function (next: any) {
    try {
        const _this = this;
        // TODO: Update time for document
        if (_this.isNew) {
            Object.assign(_this.$locals, { wasNew: _this.isNew });
        } else {
            // _this.updatedAt = Date.now();
        }

        next();
    } catch (error) {
        logger.error(error);
        throw new Error(error.message);
    }
});

// TODO: Before document created
TransactionSchema.post<ITransaction>("save", function (this: any) {
    try {
        const _this = this;
        // ! This is a document after save
        if (_this?.$locals?.wasNew) {
            // new document
        } else {
            // old document
        }
    } catch (error) {
        throw new Error(error);
    }
});

export default model<ITransaction>("Transaction", TransactionSchema);
