import { Document, model, Query, Schema } from "mongoose";
// import MongoosePaginate from "mongoose-paginate-v2";

import { logger } from "../core/log/logger.mixed";
import { ICategory } from "../interfaces/category.interface";

const CategorySchema: Schema = new Schema(
    {
        name: {
            type: Schema.Types.String,
            trim: true,
        },
        description: {
            type: Schema.Types.String,
            default: null,
            trim: true,
        },
        status: {
            type: Schema.Types.Number,
            default: 1,
        },
    },
    {
        collection: "Categories",
        timestamps: true,
    }
);

CategorySchema.set("toJSON", {
    transform: (doc: any, ret: any) => {
        ret.createdAt = ret.createdAt?.getTime();
        ret.updatedAt = ret.updatedAt?.getTime();
        delete ret.__v;
    },
});

CategorySchema.set("toObject", {
    transform: (doc: any, ret: any) => {
        ret.createdAt = ret.createdAt?.getTime();
        ret.updatedAt = ret.updatedAt?.getTime();
        delete ret.__v;
    },
});

// TODO: After write document
CategorySchema.pre<ICategory>("save", async function (next: any) {
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
CategorySchema.post<ICategory>("save", function (this: any) {
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

// TODO: Log error
CategorySchema.post<ICategory>("save", (error: any, doc: any, next: any) => {
    if (process.env.NODE_ENV === "development") {
        logger.log(doc);
    }
    if (error.name === "MongoError" && error.code === 11000)
        next(new Error("This user session already exists, please try again"));
    else next(error);
});

// TODO: Query
CategorySchema.pre<Query<Document, ICategory, ICategory>>(
    "findOne",
    async function () {
        // Prints "{ email: 'bill@microsoft.com' }"
        if (process.env.NODE_ENV === "development") {
            logger.log(this.getFilter());
        }
    }
);

// CategorySchema.plugin(MongoosePaginate);

// interface Model<T extends Document> extends PaginateModel<T> {}

// Default export
export default model<ICategory>("Category", CategorySchema);
