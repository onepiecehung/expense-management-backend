"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_config_1 = require("../../config/message.config");
const function_math_1 = require("../../utils/math/function.math");
const response_json_1 = require("../../core/response/response.json");
const router = express_1.Router();
router.all("/v1", function (req, res) {
    return response_json_1.responseSuccess(res, {
        message: message_config_1.messageWelcome[function_math_1.randomNumberBothIncluded(0, message_config_1.messageWelcome.length - 1)]
    });
});
exports.default = router;
