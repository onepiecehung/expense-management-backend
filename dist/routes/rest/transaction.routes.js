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
const express_1 = require("express");
const TransactionController = __importStar(require("../../controllers/transaction.controller"));
const auth_jwt_middleware_1 = require("../../middleware/jwt/auth.jwt.middleware");
const transaction_validation_1 = require("../../validator/transaction.validation");
const router = express_1.Router();
router
    .route("/create")
    .post(transaction_validation_1.TransactionValidator, auth_jwt_middleware_1.Authentication, TransactionController.create);
router.route("/remove/:id").put(transaction_validation_1.TransactionIDValidator, auth_jwt_middleware_1.Authentication);
router
    .route("/update/:id")
    .put(transaction_validation_1.UpdateTransactionValidator, auth_jwt_middleware_1.Authentication, TransactionController.updateOne);
router
    .route("/:id")
    .get(transaction_validation_1.TransactionIDValidator, auth_jwt_middleware_1.Authentication, TransactionController.findOne);
router.route("/:time").get(auth_jwt_middleware_1.Authentication);
exports.default = router;
