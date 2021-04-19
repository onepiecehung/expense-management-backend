"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// import MongoosePaginate from "mongoose-paginate-v2";
const logger_mixed_1 = require("../core/log/logger.mixed");
const UserSessionSchema = new mongoose_1.Schema({
    userAgent: {
        type: mongoose_1.Schema.Types.Mixed,
        default: null,
    },
    // currentAccessToken: {
    //     type: Schema.Types.String,
    //     default: null,
    // },
    // refreshToken: {
    //     type: Schema.Types.String,
    //     default: null,
    //     index: true,
    // },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        default: null,
        index: true,
    },
    status: {
        type: mongoose_1.Schema.Types.String,
        enum: ["active", "logout", "expired", "banned", "blocked"],
        default: "active",
    },
    latestAccessedAt: { type: mongoose_1.Schema.Types.Date, default: Date.now() },
    location: {
        type: mongoose_1.Schema.Types.Mixed,
        default: null,
    },
    ip: {
        type: mongoose_1.Schema.Types.String,
        default: null,
    },
    totalAccessTokenGranted: {
        type: mongoose_1.Schema.Types.Number,
        default: 0,
    },
    uuid: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        index: true,
    },
}, {
    collection: "UserSessions",
    timestamps: true,
});
UserSessionSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.createdAt = ret.createdAt?.getTime();
        ret.updatedAt = ret.updatedAt?.getTime();
        delete ret.__v;
    },
});
UserSessionSchema.set("toObject", {
    transform: (doc, ret) => {
        ret.createdAt = ret.createdAt?.getTime();
        ret.updatedAt = ret.updatedAt?.getTime();
        delete ret.__v;
    },
});
// TODO: After write document
UserSessionSchema.pre("save", async function (next) {
    try {
        const _this = this;
        if (_this.isModified("currentAccessToken")) {
            _this.latestAccessedAt = Date.now();
            _this.totalAccessTokenGranted++;
        }
        // TODO: Update time for document
        if (_this.isNew) {
            Object.assign(_this.$locals, { wasNew: _this.isNew });
        }
        else {
            _this.latestAccessedAt = Date.now();
            _this.totalAccessTokenGranted++;
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
UserSessionSchema.post("save", function () {
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
// TODO: After write document, for updateOne using Upsert
UserSessionSchema.pre("updateOne", async function (next) {
    try {
        const _this = this;
        // TODO: Default status for document
        if (!_this.isNew) {
            // ? Cause using updateOne with upsert => default isNew = false
            _this?.set("status", "active");
            _this?.set("latestAccessedAt", Date.now());
            _this?.set("totalAccessTokenGranted", _this.totalAccessTokenGranted
                ? _this.totalAccessTokenGranted++
                : 1);
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
// TODO: Log error
UserSessionSchema.post("save", (error, doc, next) => {
    if (process.env.NODE_ENV === "development") {
        logger_mixed_1.logger.log(doc);
    }
    if (error.name === "MongoError" && error.code === 11000)
        next(new Error("This user session already exists, please try again"));
    else
        next(error);
});
// TODO: Query
UserSessionSchema.pre("findOne", async function () {
    // Prints "{ email: 'bill@microsoft.com' }"
    if (process.env.NODE_ENV === "development") {
        logger_mixed_1.logger.log(this.getFilter());
    }
});
// UserSessionSchema.plugin(MongoosePaginate);
// interface Model<T extends Document> extends PaginateModel<T> {}
// Default export
exports.default = mongoose_1.model("UserSession", UserSessionSchema);
