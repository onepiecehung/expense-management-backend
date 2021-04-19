"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOne = exports.findOne = exports.create = void 0;
const logger_mixed_1 = require("../core/log/logger.mixed");
const CategoryRepository = __importStar(require("../repository/category.repository"));
async function create(categoryInfo) {
    try {
        const data = await CategoryRepository.create(categoryInfo);
        return Promise.resolve(data);
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return Promise.reject(error);
    }
}
exports.create = create;
async function findOne(categoryID) {
    try {
        const data = await CategoryRepository.findById(categoryID);
        return Promise.resolve(data ? data : {});
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return Promise.reject(error);
    }
}
exports.findOne = findOne;
async function updateOne(categoryID, categoryInfo) {
    try {
        const data = await CategoryRepository.updateOne(categoryID, categoryInfo);
        return Promise.resolve(data ? data : {});
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return Promise.reject(error);
    }
}
exports.updateOne = updateOne;
