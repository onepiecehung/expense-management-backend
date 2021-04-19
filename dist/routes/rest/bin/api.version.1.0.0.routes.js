"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_config_1 = require("../../../config/message.config");
const response_json_1 = require("../../../core/response/response.json");
const rate_limit_1 = require("../../../middleware/limit/rate.limit");
const function_math_1 = require("../../../utils/math/function.math");
const api_branching_routes_1 = __importDefault(require("./api.branching.routes"));
const router = express_1.Router();
if (process.env.NODE_ENV === `production`) {
    router.use(rate_limit_1.apiLimiter);
}
router.use("/v1", api_branching_routes_1.default);
router.all("/v1", (req, res) => {
    return response_json_1.responseSuccess(res, {
        message: message_config_1.messageWelcome[function_math_1.randomNumberBothIncluded(0, message_config_1.messageWelcome.length - 1)],
    });
});
exports.default = router;
