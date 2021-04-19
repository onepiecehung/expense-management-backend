"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOneAndUpdate = exports.create = exports.save = void 0;
const logAPI_model_1 = __importDefault(require("../models/logAPI.model"));
/**
 *
 * @param {Object} LogAPIInfo
 * @returns
 */
async function save(LogAPIInfo) {
    return LogAPIInfo.save();
}
exports.save = save;
/**
 *
 * @param {Object} LogAPIInfo
 * @returns
 */
async function create(LogAPIInfo) {
    const logAPIClass = new logAPI_model_1.default(LogAPIInfo);
    return logAPIClass.save();
}
exports.create = create;
/**
 *
 * @param LogAPIInfo
 * @returns
 */
async function findOneAndUpdate(LogAPIInfo) {
    return logAPI_model_1.default.updateOne({ uuid: LogAPIInfo.uuid }, {
        $set: LogAPIInfo,
    }, { upsert: true });
}
exports.findOneAndUpdate = findOneAndUpdate;
