"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const logger_mixed_1 = require("../core/log/logger.mixed");
const user_model_1 = __importDefault(require("./user.model"));
const LogAPISchema = new mongoose_1.Schema({
    originalUrl: {
        type: mongoose_1.Schema.Types.String,
        default: "Unknown",
    },
    method: {
        type: mongoose_1.Schema.Types.String,
        default: "GET",
    },
    hostname: {
        type: mongoose_1.Schema.Types.String,
        default: "127.0.0.1",
    },
    httpVersion: {
        type: mongoose_1.Schema.Types.String,
    },
    protocol: {
        type: mongoose_1.Schema.Types.String,
    },
    level: {
        type: mongoose_1.Schema.Types.Number,
        default: 0,
    },
    userAgent: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
    body: {
        type: mongoose_1.Schema.Types.Mixed,
        default: { data: "empty" },
    },
    query: {
        type: mongoose_1.Schema.Types.Mixed,
        default: { data: "empty" },
    },
    ip: {
        type: mongoose_1.Schema.Types.String,
        default: "0.0.0.0/32",
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: user_model_1.default,
        default: null,
    },
    location: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    closingTimeMs: {
        type: mongoose_1.Schema.Types.String,
        default: null,
    },
    isClosingTime: {
        type: mongoose_1.Schema.Types.Boolean,
        default: false,
    },
    finishedTimeMs: {
        type: mongoose_1.Schema.Types.String,
        default: null,
    },
    isFinishedTime: {
        type: mongoose_1.Schema.Types.Boolean,
        default: false,
    },
    uuid: {
        type: mongoose_1.Schema.Types.String,
        default: null,
    },
}, {
    timestamps: true,
    collection: "LogAPIs",
});
LogAPISchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.__v;
    },
});
LogAPISchema.set("toObject", {
    transform: (doc, ret) => {
        delete ret.__v;
    },
});
LogAPISchema.pre("save", async function (next) {
    try {
        const _this = this;
        // TODO: Update time for document
        if (_this.isNew) {
            Object.assign(_this.$locals, { wasNew: _this.isNew });
            // _this.$locals.wasNew = _this.isNew;
            // _this.createdAt = Date.now();
            // _this.updatedAt = Date.now();
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
LogAPISchema.post("save", function () {
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
// TODO: Log error
LogAPISchema.post("save", (error, doc, next) => {
    if (process.env.NODE_ENV === "development") {
        logger_mixed_1.logger.log(doc);
    }
    if (error.name === "MongoError" && error.code === 11000)
        next(new Error("This document already exists, please try again"));
    else
        next(error);
});
// TODO: Query
LogAPISchema.pre("findOne", async function () {
    // Prints "{ email: 'bill@microsoft.com' }"
    if (process.env.NODE_ENV === "development") {
        logger_mixed_1.logger.log(this.getFilter());
    }
});
// Set up PaginateModel
// LogAPISchema.plugin(MongoosePaginate);
// interface Model<T extends Document> extends PaginateModel<T> {}
// Default export
exports.default = mongoose_1.model("LogAPI", LogAPISchema);
