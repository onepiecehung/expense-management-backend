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
const response_json_1 = require("../core/response/response.json");
const CategoryService = __importStar(require("../services/category.service"));
async function create(req, res) {
    try {
        const data = await CategoryService.create(req.body);
        return response_json_1.responseSuccess(res, data, 200);
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error);
    }
}
exports.create = create;
async function findOne(req, res) {
    try {
        const data = await CategoryService.findOne(req.params.id);
        return response_json_1.responseSuccess(res, data, 200);
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error);
    }
}
exports.findOne = findOne;
async function updateOne(req, res) {
    try {
        const data = await CategoryService.updateOne(req.params.id, req.body);
        return response_json_1.responseSuccess(res, data, 200);
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return response_json_1.responseError(req, res, error);
    }
}
exports.updateOne = updateOne;
