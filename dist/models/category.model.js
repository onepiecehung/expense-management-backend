"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// import MongoosePaginate from "mongoose-paginate-v2";
const logger_mixed_1 = require("../core/log/logger.mixed");
const CategorySchema = new mongoose_1.Schema({
    name: {
        type: mongoose_1.Schema.Types.String,
        trim: true,
    },
    description: {
        type: mongoose_1.Schema.Types.String,
        default: null,
        trim: true,
    },
    status: {
        type: mongoose_1.Schema.Types.Number,
        default: 1,
    },
}, {
    collection: "Categories",
    timestamps: true,
});
CategorySchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.createdAt = ret.createdAt?.getTime();
        ret.updatedAt = ret.updatedAt?.getTime();
        delete ret.__v;
    },
});
CategorySchema.set("toObject", {
    transform: (doc, ret) => {
        ret.createdAt = ret.createdAt?.getTime();
        ret.updatedAt = ret.updatedAt?.getTime();
        delete ret.__v;
    },
});
// TODO: After write document
CategorySchema.pre("save", async function (next) {
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
CategorySchema.post("save", function () {
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
CategorySchema.post("save", (error, doc, next) => {
    if (process.env.NODE_ENV === "development") {
        logger_mixed_1.logger.log(doc);
    }
    if (error.name === "MongoError" && error.code === 11000)
        next(new Error("This user session already exists, please try again"));
    else
        next(error);
});
// TODO: Query
CategorySchema.pre("findOne", async function () {
    // Prints "{ email: 'bill@microsoft.com' }"
    if (process.env.NODE_ENV === "development") {
        logger_mixed_1.logger.log(this.getFilter());
    }
});
// CategorySchema.plugin(MongoosePaginate);
// interface Model<T extends Document> extends PaginateModel<T> {}
// Default export
exports.default = mongoose_1.model("Category", CategorySchema);
