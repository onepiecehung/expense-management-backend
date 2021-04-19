"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const logger_mixed_1 = require("../core/log/logger.mixed");
const user_model_1 = __importDefault(require("./user.model"));
const TransactionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: user_model_1.default,
        index: true,
    },
    date: {
        type: mongoose_1.Schema.Types.Date,
        required: true,
    },
    price: {
        type: mongoose_1.Schema.Types.Number,
        required: true,
    },
    currency: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    category: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    note: {
        type: mongoose_1.Schema.Types.String,
    },
    status: {
        type: mongoose_1.Schema.Types.Number,
        default: 1,
    },
}, {
    timestamps: true,
    collection: "Transactions",
});
TransactionSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.createdAt = ret.createdAt?.getTime();
        ret.updatedAt = ret.updatedAt?.getTime();
        ret.date = ret.date?.getTime();
        delete ret.status;
        delete ret.__v;
    },
});
TransactionSchema.set("toObject", {
    transform: (doc, ret) => {
        ret.createdAt = ret.createdAt?.getTime();
        ret.updatedAt = ret.updatedAt?.getTime();
        ret.date = ret.date?.getTime();
        delete ret.status;
        delete ret.__v;
    },
});
// TODO: After write document
TransactionSchema.pre("save", async function (next) {
    try {
        const _this = this;
        // TODO: Update time for document
        if (_this.isNew) {
            Object.assign(_this.$locals, { wasNew: _this.isNew });
        }
        else {
            // _this.updatedAt = Date.now();
        }
        next();
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        throw new Error(error.message);
    }
});
// TODO: Before document created
TransactionSchema.post("save", function () {
    try {
        const _this = this;
        // ! This is a document after save
        if (_this?.$locals?.wasNew) {
            // new document
        }
        else {
            // old document
        }
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.default = mongoose_1.model("Transaction", TransactionSchema);
