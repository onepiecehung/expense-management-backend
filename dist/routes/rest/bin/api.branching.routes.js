"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_routes_1 = __importDefault(require("../category.routes"));
const user_routes_1 = __importDefault(require("../user.routes"));
const transaction_routes_1 = __importDefault(require("../transaction.routes"));
const router = express_1.Router();
router.use("/users", user_routes_1.default);
router.use("/categories", category_routes_1.default);
router.use("/transactions", transaction_routes_1.default);
exports.default = router;
