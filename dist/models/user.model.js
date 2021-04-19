"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const mongoose_1 = require("mongoose");
// import MongoosePaginate from "mongoose-paginate-v2";
const user_config_1 = require("../config/user.config");
const logger_mixed_1 = require("../core/log/logger.mixed");
const UserSchema = new mongoose_1.Schema({
    lastName: {
        type: mongoose_1.Schema.Types.String,
        trim: true,
        default: null,
    },
    firstName: {
        type: mongoose_1.Schema.Types.String,
        trim: true,
        default: null,
    },
    username: {
        type: mongoose_1.Schema.Types.String,
        trim: true,
        index: true,
        unique: true,
        sparse: true,
        lowercase: true,
    },
    email: {
        type: mongoose_1.Schema.Types.String,
        trim: true,
        index: true,
        unique: true,
        sparse: true,
        lowercase: true,
    },
    password: {
        type: mongoose_1.Schema.Types.String,
        trim: true,
    },
    gender: {
        type: mongoose_1.Schema.Types.Number,
        enum: [0, 1, 2],
        default: 0,
    },
    birthday: {
        type: mongoose_1.Schema.Types.Date,
        default: null,
    },
    phoneNumber: {
        type: mongoose_1.Schema.Types.String,
        default: null,
    },
    avatar: {
        type: mongoose_1.Schema.Types.String,
        default: null,
    },
    status: {
        type: mongoose_1.Schema.Types.String,
        enum: user_config_1.USER_STATUS,
        default: user_config_1.USER_STATUS[0],
    },
    createdAt: {
        type: mongoose_1.Schema.Types.Date,
        default: null,
    },
    updatedAt: {
        type: mongoose_1.Schema.Types.Date,
        default: null,
    },
}, {
    timestamps: true,
    collection: "Users", // TODO: Set name collection
});
UserSchema.set("toJSON", {
    transform: (doc, ret) => {
        if (ret.gender === 0) {
            ret.gender = `Other`;
        }
        if (ret.gender === 1) {
            ret.gender = `Male`;
        }
        if (ret.gender === 2) {
            ret.gender = `Female`;
        }
        if (!ret.avatar) {
            ret.avatar = `https://i.imgur.com/rvipRmU.jpg`;
        }
        ret.createdAt = ret.createdAt?.getTime();
        ret.updatedAt = ret.updatedAt?.getTime();
        delete ret.status;
        delete ret.password;
        delete ret.__v;
    },
});
UserSchema.set("toObject", {
    transform: (doc, ret) => {
        if (ret.gender === 0) {
            ret.gender = `Other`;
        }
        if (ret.gender === 1) {
            ret.gender = `Male`;
        }
        if (ret.gender === 2) {
            ret.gender = `Female`;
        }
        if (!ret.avatar) {
            ret.avatar = `https://i.imgur.com/rvipRmU.jpg`;
        }
        ret.createdAt = ret.createdAt?.getTime();
        ret.updatedAt = ret.updatedAt?.getTime();
        // delete ret.status;
        // delete ret.password;
        delete ret.__v;
    },
});
// TODO: Virtual;
UserSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});
// TODO: Methods
// UserSchema.methods.getGender = function (this: IUserBaseDocument) {
//     return this.gender > 0 ? "Male" : "Female";
// };
UserSchema.pre("save", async function (next) {
    try {
        const _this = this;
        if (_this.isModified("password")) {
            const salt = bcrypt_1.genSaltSync(10);
            _this.password = bcrypt_1.hashSync(_this.password, salt);
        }
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
UserSchema.post("save", function () {
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
UserSchema.post("save", (error, doc, next) => {
    if (process.env.NODE_ENV === "development") {
        logger_mixed_1.logger.log(doc);
    }
    if (error.name === "MongoError" && error.code === 11000)
        next(new Error("This user already exists, please try again"));
    else
        next(error);
});
// TODO: Query
UserSchema.pre("findOne", async function () {
    // Prints "{ email: 'bill@microsoft.com' }"
    if (process.env.NODE_ENV === "development") {
        logger_mixed_1.logger.log(this.getFilter());
    }
});
// UserSchema.pre<IUser>("findOne", function () {
//     // Prints "{ email: 'bill@microsoft.com' }"
//     logger.log(this.getFilter());
// });
// Query middleware
// UserSchema.post<Query<IUser>>("findOneAndUpdate", async function (doc) {
// })
// Set up PaginateModel
// UserSchema.plugin(MongoosePaginate);
// interface Model<T extends Document> extends PaginateModel<T> {}
// Default export
exports.default = mongoose_1.model("User", UserSchema);
